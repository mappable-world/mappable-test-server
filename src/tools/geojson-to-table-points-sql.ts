import type {Feature} from '../app/lib/geo';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// ts-node ./src/tools/geojson-to-table-points-sql.ts compose/data/ne_10m_admin_1_label_points.geojson compose/data/dump/points.sql

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
    .map((f: Feature) => `\t('(${f.geometry.coordinates})', '${JSON.stringify(f).replace(/'/g, "''")}')`)
    .join(',\n')};`;

    inserts.push(sql);
}

fs.writeFileSync(output, '\\connect api\n' + inserts.join('\n\n'));
