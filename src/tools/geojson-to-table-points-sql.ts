import * as process from 'process';
import {URL} from 'url';
import got from 'got';
import type {FeatureCollection, Point} from 'geojson';
import {DB} from '../app/lib/pool';

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

    while (data.features.length) {
        const points = data.features.splice(0, 1000);

        const db = DB.getInstance();

        await Promise.all(
            points.map((point) =>
                db
                    .query(`INSERT INTO points (coordinates, json) VALUES ('POINT($1)', $2)`, [
                        point.geometry.coordinates.join(' '),
                        JSON.stringify(point)
                    ])
                    .catch((e) => console.error(e))
            )
        );
    }
})();
