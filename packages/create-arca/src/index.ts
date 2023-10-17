import prompts from 'prompts';
import { createProject, readTemplates, setupConfig } from './utils';
import { red } from 'kolorist';
import fs from 'fs';

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
			name: 'overwrite',
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
			type: 'confirm',
			name: 'prettier',
			message: 'Use prettier?',
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

	const projectName = result.name;

	if (result.overwrite) {
		fs.rmSync(projectName, { recursive: true });
	}

	if (result.isCreate) {
		createProject({
			packageManager: result.packageManager,
			type: result.type,
			template: result.template,
			projectName,
		});
	}

	setupConfig({
		projectName,
		eslint: result.eslint,
		prettier: result.prettier,
	});
};

init().catch(error => {
	console.error(error);
	process.exit(1);
});
