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
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n' +
    '  <rect x="1" y="-1" width="20" height="20" rx="7" transform="matrix(-1 0 0 1 23 3)" fill="#313133" stroke="white" stroke-width="2"/>\n' +
    '  <rect width="6" height="6" rx="2" transform="matrix(-1 0 0 1 15 9)" fill="white"/>\n' +
    '</svg>';

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
                        map.setLocation({bounds: feature.properties.minMax, duration: 400});
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
        canvas.width = TILE_SIZE * window.devicePixelRatio;
        canvas.height = TILE_SIZE * window.devicePixelRatio;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#010101';
        ctx.font = '26px sans-serif';
        ctx.strokeRect(0, 0, TILE_SIZE * window.devicePixelRatio, TILE_SIZE * window.devicePixelRatio);
        ctx.fillText(`${x}-${y}-${z}`, 10, 30);
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
            fill: '#EEFD7D',
            fillOpacity: 0.5,
            stroke: [{color: '#e07e7e', width: 2}]
        }
    });
    map.addChild(entity);
    setTimeout(() => {
        map.removeChild(entity);
    }, 1000);
}
