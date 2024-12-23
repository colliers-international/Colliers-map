import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'], 
    format: ['cjs', 'esm'],  
    dts: true,               
    external: ['mapbox-gl'], // Prevent bundling mapbox-gl
    splitting: false,        
    clean: true,             
});