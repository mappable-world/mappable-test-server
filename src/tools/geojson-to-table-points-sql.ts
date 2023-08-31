import * as process from 'process';
import {URL} from 'url';
import got from 'got';
import type {FeatureCollection, Point} from 'geojson';
import {DB} from '../app/lib/pool';
import dotenv from 'dotenv';

dotenv.config();

// ts-node ./src/tools/geojson-to-table-points-sql.ts https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson

const file = process.argv[2];

const fileUrl = new URL(file);
if (!fileUrl.protocol || !fileUrl.host || !fileUrl.pathname) {
    console.error('Incorrect file url');
    process.exit(0);
}

(async () => {
    const content = await got(fileUrl.href);
    const data = JSON.parse(content.body) as FeatureCollection<Point>;

    const db = DB.getInstance();

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
