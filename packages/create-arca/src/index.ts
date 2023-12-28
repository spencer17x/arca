import prompts from 'prompts';
import { createProject, readTemplates, setupConfig } from './utils';
import { red } from 'kolorist';
import fs from 'fs';
import path from 'path';
import { eslintConfigFiles, prettierConfigFiles } from './variables';

const init = async () => {
	const result = await prompts([
		{
			type: 'confirm',
			name: 'isCreate',
			message: 'Create a new project?',
			initial: true,
		},
		{
			type: prev => (prev ? 'text' : null),
			name: 'name',
			message: 'Project name:',
			validate: value => (value ? true : ' Project name is required'),
			initial: 'my-project'
		},
		{
			type: prev => fs.existsSync(prev) ? 'confirm' : null,
			name: 'overwriteName',
			message: prev => `Target directory ${prev} already exists. Overwrite?`,
			initial: true,
		},
		{
			type: 'confirm',
			name: 'eslint',
			message: 'Use eslint?',
			initial: true,
		},
		{
			name: 'overwriteEslint',
			type: (prev, values) => eslintConfigFiles.some(file => {
				return prev && fs.existsSync(path.join(values.name || '.', file));
			}) ? 'confirm' : null,
			message: 'Target directory already has eslint config file. Overwrite?',
			initial: true,
		},
		{
			type: 'confirm',
			name: 'prettier',
			message: 'Use prettier?',
			initial: true,
		},
		{
			name: 'overwritePrettier',
			type: (prev, values) => prettierConfigFiles.some(file => {
				return prev && fs.existsSync(path.join(values.name || '.', file));
			}) ? 'confirm' : null,
			message: 'Target directory already has prettier config file. Overwrite?',
			initial: true,
		},
		{
			type: (_prev, values) => values.isCreate ? 'select' : null,
			name: 'type',
			message: 'Select project type:',
			choices: [
				{ title: 'template', value: 'template' },
				{ title: 'vite', value: 'vite' },
				// { title: 'monorepo', value: 'monorepo' },
			]
		},
		{
			type: prev => prev === 'template' ? 'select' : null,
			name: 'template',
			message: 'Select template:',
			choices: readTemplates().map(name => ({ title: name, value: name })),
		},
		{
			type: (_prev, values) => values.isCreate ? 'select' : null,
			name: 'packageManager',
			message: 'Select package manager:',
			choices: [
				{ title: 'npm', value: 'npm' },
				{ title: 'yarn', value: 'yarn' },
				{ title: 'pnpm', value: 'pnpm' },
			]
		}
	], {
		onCancel: () => {
			throw new Error(red('✖') + ' Operation cancelled');
		},
	});

	const {
		name: projectName,
		eslint,prettier,
		isCreate, packageManager, type, template,
		overwriteName, overwriteEslint, overwritePrettier
	} = result;

	if (overwriteName) {
		fs.rmSync(projectName, { recursive: true });
	}

	if (isCreate) {
		createProject({
			packageManager,
			type,
			template,
			projectName,
		});
	}

	setupConfig({
		projectName,
		eslint,
		prettier,
		overwriteEslint,
		overwritePrettier,
	});
};

init().catch(error => {
	console.error(error);
	process.exit(1);
});
