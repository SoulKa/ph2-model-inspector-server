export enum FileNodeType {
    DIRECTORY = 0,
    MODEL = 1
}

declare type FileNodeObjectBase = {
    name: string;
    type: FileNodeType
};

export type ModelObject = FileNodeObjectBase & {
    type: FileNodeType.MODEL;
    modelPath: string;
    texturePath?: string;
};

export type DirectoryObject = FileNodeObjectBase & {
    type: FileNodeType.DIRECTORY;
    children: ModelFolderObject;
};

export type FileNodeObject = ModelObject|DirectoryObject;
export type ModelFolderObject = FileNodeObject[];