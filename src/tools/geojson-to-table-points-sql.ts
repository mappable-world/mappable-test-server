import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

const file = path.resolve(process.cwd(), process.argv[2]);
const output = path.resolve(process.cwd(), process.argv[3]);

if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    console.error('Incorrect file');
    process.exit(0);
}

const content = fs.readFileSync(file, 'utf-8');
const data = JSON.parse(content);

type Feature = {
    type: 'Feature';
    properties: {
        OBJECTID_1: number;
        diss_me: number;
        adm1_code: string;
        sr_sov_a3: string;
        sr_adm0_a3: string;
        sr_gu_a3: string;
        iso_a2: string;
        adm0_sr: number;
        name: string;
        admin: string;
        scalerank: number;
        datarank: number;
        featureclass: string;
    };
    geometry: {type: 'Point'; coordinates: [number, number]};
};

const sql = `INSERT INTO public.points (coordinates, title) VALUES
${data.features.map((f: Feature) => `\t('(${f.geometry.coordinates})', NULL)`).join(',\n')};`;

fs.writeFileSync(output, sql);
