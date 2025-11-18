import prompts, { PromptObject } from 'prompts';

export interface ProjectAnswers {
  name: string;
  orm: string;
  database: string;
  typescript: boolean;
}

export async function promptProjectInfo(
  initialName?: string
): Promise<ProjectAnswers> {
  const questions: PromptObject<string>[] = [
    {
      type: initialName ? null : 'text',
      name: 'name',
      message: 'What is your project name?',
      initial: 'fastay-app',
    },
    {
      type: 'select',
      name: 'typescript',
      message: 'Use TypeScript?',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
    },

    {
      type: 'select',
      name: 'orm',
      message: 'Choose an ORM:',
      choices: [
        { title: 'Prisma', value: 'prisma' },
        { title: 'None', value: 'none' },
      ],
    },
  ];

  const result = await prompts(questions);

  return {
    name: initialName || result.name,
    orm: result.orm,
    database: result.database,
    typescript: result.typescript,
  };
}
