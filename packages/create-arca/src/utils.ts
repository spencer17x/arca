import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import replace from 'replace-in-file';
import { eslintConfigFiles, prettierConfigFiles } from './variables';

export const runCMD = (command: string, args: string[]) => {
	return spawnSync(
		command,
		args,
		{
			stdio: 'inherit',
			shell: true
		}
	);
};

export const readTemplates = () => {
	return fs.readdirSync(path.resolve(__dirname, '../source/templates'));
};

export const addDevDependencies = (projectName: string, devDependencies: Record<string, string>) => {
	const packageJsonPath = path.resolve(process.cwd(), `${projectName}/package.json`);
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	fs.writeFileSync(packageJsonPath, JSON.stringify({
		...packageJson,
		devDependencies: {
			...packageJson.devDependencies,
			...devDependencies,
		}
	}, null, 2));
};

export const setupConfig = (config: {
	projectName: string,
	eslint: boolean,
	prettier: boolean,
	overwriteEslint: boolean,
	overwritePrettier: boolean,
}) => {
	const {
		projectName = '.',
		eslint, prettier,
		overwriteEslint, overwritePrettier
	} = config;
	if (overwriteEslint) {
		eslintConfigFiles.forEach(file => {
			const filePath = path.resolve(process.cwd(), `${projectName}/${file}`);
			if (fs.existsSync(filePath)) {
				fs.rmSync(filePath);
			}
		});
	}

	if (overwritePrettier) {
		prettierConfigFiles.forEach(file => {
			const filePath = path.resolve(process.cwd(), `${projectName}/${file}`);
			if (fs.existsSync(filePath)) {
				fs.rmSync(filePath);
			}
		});
	}

	if (eslint) {
		const src = path.resolve(__dirname, '../source/configs/_eslint');
		const dest = path.resolve(process.cwd(), `${projectName}/.eslintrc.cjs`);
		fs.copyFileSync(src, dest);
		addDevDependencies(projectName, {
			'eslint-plugin-simple-import-sort': '^10.0.0',
		});
	}


	if (prettier) {
		const src = path.resolve(__dirname, '../source/configs/_prettier');
		const dest = path.resolve(process.cwd(), `${projectName}/.prettierrc.cjs`);
		fs.copyFileSync(src, dest);
		addDevDependencies(projectName, {
			'prettier': '^3.0.3',
		});
	}
};

export const copyDirectory = (source: string, destination: string) => {
	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination);
	}

	const files = fs.readdirSync(source);

	for (const file of files) {
		const sourcePath = path.join(source, file);
		const destPath = path.join(destination, file);

		const stat = fs.statSync(sourcePath);

		if (stat.isFile()) {
			fs.copyFileSync(sourcePath, destPath);
		} else if (stat.isDirectory()) {
			copyDirectory(sourcePath, destPath);
		}
	}
};

export const createProject = (config: {
	type: string,
	packageManager: string,
	template: string,
	projectName: string
}) => {
	const {
		type,
		packageManager,
		template,
		projectName
	} = config;

	if (type === 'vite') {
		// https://vitejs.dev/guide/#scaffolding-your-first-vite-project
		createViteProject({
			packageManager,
			projectName,
		});
		return;
	}
	if (type === 'template') {
		createTemplateProject({
			projectName,
			template
		});
		return;
	}
	if (type === 'monorepo') {
		if (packageManager === 'pnpm') {
			createPnpmMonorepo(projectName);
			return;
		}
		if (packageManager === 'yarn') {
			createYarnMonorepo(projectName);
			return;
		}
		console.log('Not implemented yet');
		return;
	}
};

export const createViteProject = (config: {
	packageManager: string,
	projectName: string,
}) => {
	const {
		packageManager,
		projectName,
	} = config;

	runCMD(
		packageManager,
		['create', 'vite@latest', projectName],
	);
};

export const createTemplateProject = (config: {
	projectName: string,
	template: string
}) => {
	const { template, projectName } = config;
	const src = path.resolve(__dirname, `../source/templates/${template}`);
	const dest = path.resolve(process.cwd(), projectName);
	copyDirectory(src, dest);
	fs.renameSync(
		path.resolve(dest, './_gitignore'),
		path.resolve(dest, './.gitignore')
	);

	replace.sync({
		from: /--libraryname--/g,
		to: projectName,
		files: `${projectName}/*`
	});
};

export const createPnpmMonorepo = (name: string) => {
	throw new Error('Not implemented yet');
};

export const createYarnMonorepo = (name: string) => {
	throw new Error('Not implemented yet');
};
