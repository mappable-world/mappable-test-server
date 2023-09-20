mappable.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('@mappable-world/mappable-entity-tile-loader')) {
        return;
    }

    await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);

    Object.assign(mappable, window[`${pkg}`]);
    return window[`${pkg}`];
});

const SEARCH_PARAMS = new URLSearchParams(window.location.search);

const FIXED_POINT = [55.8994004655942, 25.334356212181216];

const LOCATION = {
    center: SEARCH_PARAMS.get('center') ? SEARCH_PARAMS.get('center').split(',').map(Number) : FIXED_POINT,
    zoom: SEARCH_PARAMS.get('zoom') ? +SEARCH_PARAMS.get('zoom') : 8
};

const ZOOM_RANGE = {min: 4, max: 19};
const TILE_SIZE = 256;
const TEST_TILE_SERVER = 'https://mappable-test-server-d7778c5d7460.herokuapp.com';
const MODE = ['tile-clusterer', 'tile', 'bbox'].includes(SEARCH_PARAMS.get('mode'))
    ? SEARCH_PARAMS.get('mode')
    : 'tile';
const SHOW_MODE_SWITCHER = SEARCH_PARAMS.get('hideModeSwitcher') !== 'true';
const SHOW_CELLS = SEARCH_PARAMS.get('showCells') === 'true';

const markerElement = document.createElement('div');
markerElement.classList.add('circle');
markerElement.innerHTML =
    '<svg height="24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><g transform="translate(0 -1028.4)"><path d="m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z" fill="#e74c3c" transform="translate(0 1028.4)"/><path d="m12 3c-2.7614 0-5 2.2386-5 5 0 2.761 2.2386 5 5 5 2.761 0 5-2.239 5-5 0-2.7614-2.239-5-5-5zm0 2c1.657 0 3 1.3431 3 3s-1.343 3-3 3-3-1.3431-3-3 1.343-3 3-3z" fill="#c0392b" transform="translate(0 1028.4)"/></g></svg>';

function makeEntity(map, feature) {
    const elm = markerElement.cloneNode(true);

    if (feature.properties.count > 1) {
        elm.classList.remove('circle');
        elm.classList.add('cluster');
        elm.style.setProperty('--radius', Math.max(feature.properties.count.toString().length * 20, 40) + 'px');
        elm.innerHTML = `<div class="cluster-content"><span class="cluster-text">${feature.properties.count}</span></div>`;
    }

    elm.title = `${feature.properties.name ?? ''} ${feature.properties.admin} `;

    return new mappable.MMapMarker(
        {
            id: feature.id,
            coordinates: feature.geometry.coordinates,
            onDoubleClick: (e) => {
                if (feature.properties.minMax) {
                    if (SHOW_CELLS) {
                        showBounds(feature.properties.minMax);
                    }
                    setTimeout(() => {
                        map.setLocation({bounds: feature.properties.minMaxx, duration: 400});
                    }, 300);
                }
            }
        },
        elm
    );
}

const cache = new Map();

/**
 * Function to fetch a tile from real remote server.
 *
 * @param tx
 * @param ty
 * @param tz
 * @param signal
 * @returns {Promise<any|*[]>}
 */
async function fetchTile({tx, ty, tz, signal}) {
    const key = `${tx}-${ty}-${tz}`;
    if (cache.has(key)) {
        return cache.get(key);
    }

    let features = [];

    try {
        const data = await fetch(`${TEST_TILE_SERVER}/v1/${MODE}?x=${tx}&y=${ty}&z=${tz}`, {
            signal
        }).then((resp) => resp.json());
        signal.throwIfAborted();

        if (SHOW_CELLS) {
            showBounds(data.bounds);
        }

        features = [...data.features];

        cache.set(key, features);
    } catch (e) {
        if (!e.message.includes('aborted')) {
            console.error(e);
        }
    }

    return features;
}

let controller;

async function fetchBound([[lng1, lat1], [lng2, lat2]]) {
    if (controller) {
        controller.abort();
        controller = null;
    }

    const key = `${lng1}-${lat1}-${lng2}-${lat2}`;
    if (cache.has(key)) {
        return cache.get(key);
    }

    controller = new AbortController();
    const signal = controller.signal;

    const data = await fetch(
        `${TEST_TILE_SERVER}/v1/${MODE}?lng1=${lng1}&lat1=${lat1}&lng2=${lng2}&lat2=${lat2}&limit=10000`,
        {
            signal
        }
    ).then((resp) => resp.json());

    const features = [...data.features];
    controller = null;

    cache.set(key, features);

    return features;
}

const layerId = 'A';
const dataSource = {
    type: layerId,
    fetchTile: (x, y, z) => {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#010101';
        ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.fillText(`${x}-${y}-${z}`, 10, 15);
        return Promise.resolve({image: canvas});
    }
};

function showBounds(bounds) {
    const entity = new mappable.MMapFeature({
        id: 'bounds' + bounds.toString(),
        geometry: {
            type: 'Polygon',
            coordinates: [[bounds[0], [bounds[0][0], bounds[1][1]], bounds[1], [bounds[1][0], bounds[0][1]]]]
        },
        style: {
            fill: 'rgba(56, 56, 219, 0.5)',
            stroke: [{color: '#e07e7e', width: 2}]
        }
    });
    map.addChild(entity);
    setTimeout(() => {
        map.removeChild(entity);
    }, 1000);
}
