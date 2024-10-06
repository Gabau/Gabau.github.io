

// virtual file system objects
type VirtualFile = {
    parent: number,
    id: number,
    children: Map<string, VirtualFile>,
    data: string,
    name: string,
    fileType: "file" | "directory"
};

