import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import {URL} from 'url';
import got from 'got';
import type {FeatureCollection, Point} from 'geojson';

// ts-node ./src/tools/geojson-to-table-points-sql.ts https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson compose/data/dump/points.sql

const file = process.argv[2];
const output = path.resolve(process.cwd(), process.argv[3]);

const fileUrl = new URL(file);
if (!fileUrl.protocol || !fileUrl.host || !fileUrl.pathname) {
    console.error('Incorrect file url');
    process.exit(0);
}

(async () => {
    const content = await got(fileUrl.href);
    const data = JSON.parse(content.body) as FeatureCollection<Point>;

    const inserts: string[] = [];
    while (data.features.length) {
        const points = data.features.splice(0, 1000);
        const sql = `INSERT INTO public.points (coordinates, json) VALUES
${points
    // Replace LatLng to LngLat and use PostGis format for point
    .map((f) => `\t('POINT(${f.geometry.coordinates.join(' ')})', '${JSON.stringify(f).replace(/'/g, "''")}')`)
    .join(',\n')};`;

        inserts.push(sql);
    }

    fs.writeFileSync(output, '\\connect api\n' + inserts.join('\n\n'));
})();
