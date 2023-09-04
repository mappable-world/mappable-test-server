type Environment = 'production' | 'testing' | 'development';

export const ENVIRONMENT = (process.env.ENVIRONMENT as Environment) || 'development';

export const DEFAULT_JSON_URL =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson';
