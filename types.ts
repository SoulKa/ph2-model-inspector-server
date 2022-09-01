export type ModelObject = {
    modelPath: string;
    texturePath?: string;
};

export type ModelFolderObject = { [directory: string]: ModelFolderObject|boolean };