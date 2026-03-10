import fs from 'fs';
import path from 'path';
import { transformSync } from '@babel/core';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.d.ts')) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted definition file: ${fullPath}`);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const isTsx = file.endsWith('.tsx');
            const ext = isTsx ? '.jsx' : '.js';
            const newPath = fullPath.replace(/\.tsx?$/, ext);

            const code = fs.readFileSync(fullPath, 'utf8');

            try {
                const result = transformSync(code, {
                    filename: fullPath,
                    presets: [
                        ['@babel/preset-typescript', { isTSX: isTsx, allExtensions: true }],
                    ],
                    plugins: [
                        '@babel/plugin-syntax-jsx'
                    ],
                    retainLines: true,
                });

                if (result && result.code) {
                    fs.writeFileSync(newPath, result.code, 'utf8');
                    fs.unlinkSync(fullPath); // Delete old TS file
                    console.log(`Converted ${fullPath} -> ${newPath}`);
                }
            } catch (err) {
                console.error(`Failed to transform ${fullPath}`, err);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
