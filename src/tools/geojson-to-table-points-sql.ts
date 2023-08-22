import type {Feature} from '../app/lib/geo';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// ts-node ./src/tools/geojson-to-table-points-sql.ts src/tests/data/ne_10m_admin_1_label_points.json compose/data/dump/points.sql

const file = path.resolve(process.cwd(), process.argv[2]);
const output = path.resolve(process.cwd(), process.argv[3]);

if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    console.error('Incorrect file');
    process.exit(0);
}

const content = fs.readFileSync(file, 'utf-8');
const data = JSON.parse(content);

const inserts: string[] = [];
while (data.features.length) {
    const points = data.features.splice(0, 1000);
    const sql = `INSERT INTO public.points (coordinates, json) VALUES
${points
    // Replace LatLng to LngLat and use PostGis format for point
    .map((f: Feature) => `\t('POINT(${f.geometry.coordinates.join(' ')})', '${JSON.stringify(f).replace(/'/g, "''")}')`)
    .join(',\n')};`;

    inserts.push(sql);
}

fs.writeFileSync(output, '\\connect api\n' + inserts.join('\n\n'));
