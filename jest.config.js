// eslint-disable-next-line no-undef
module.exports = {
    verbose: true,
    preset: 'ts-jest',
    automock: false,
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
                isolatedModules: true
            }
        ]
    }
};
