import * as process from 'process';
import {URL} from 'url';
import got from 'got';
import type {FeatureCollection, Point} from 'geojson';
import dotenv from 'dotenv';
import {config} from '../app/config';
import {Pool} from 'pg';

dotenv.config();

// POINTS_JSON=https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson ts-node ./src/tools/geojson-to-table-points-sql.ts

const fileUrl = new URL(config.pointsImportUrl);

if (!fileUrl.protocol || !fileUrl.host || !fileUrl.pathname) {
    console.error('Incorrect file url');
    process.exit(0);
}

(async () => {
    const content = await got(fileUrl.href);
    const data = JSON.parse(content.body) as FeatureCollection<Point>;

    const db = new Pool(config.db);

    while (data.features.length) {
        const chunk = data.features.splice(0, 1000);

        await db.query(
            `
              INSERT INTO points (coordinates, feature)
              SELECT ST_GeomFromGeoJSON(feature->>'geometry'::text) as coordinates, feature
              FROM json_to_recordset($1) AS x (feature json)
            `,
            [JSON.stringify(chunk.map((feature) => ({feature})))]
        );
    }
})();
