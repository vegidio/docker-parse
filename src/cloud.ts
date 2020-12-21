class Cloud {
    static async init(classes: string[]): Promise<void> {
        classes.forEach((className) => {
            this.deleteFileWhenFieldChanges(className);
            this.deleteAllFilesWhenObjectIsDelete(className);
        });
    }

    /**
     * Delete a file when a field of type 'File' is removed or replaced
     * @param className
     */
    static deleteFileWhenFieldChanges(className: string): void {
        Parse.Cloud.beforeSave(className, async (req) => {
            const oldFields = this.getFileFields(req.original);
            const newFields = this.getFileFields(req.object);

            // No field remove; we can stop here
            if (newFields.length > oldFields.length) return;

            for (const field of oldFields) {
                const oldFile = req.original.get(field)?.name();
                const newFile = req.object.get(field)?.name();

                // It's the same file, so go to the next one
                if (newFile === oldFile) continue;
                this.deleteFile(oldFile);
            }
        });
    }

    /**
     * Delete all files when a document is deleted
     * @param className
     */
    static deleteAllFilesWhenObjectIsDelete(className: string): void {
        Parse.Cloud.beforeDelete(className, async (req) => {
            const fields = this.getFileFields(req.object);

            for (const field of fields) {
                const file = req.object.get(field)?.name();

                // Skip if the file does not exist
                if (file.length === 0) continue;
                this.deleteFile(file);
            }
        });
    }

    // region - Private methods
    private static getFileFields(obj: Parse.Object): string[] {
        const fields: string[] = [];
        if (!obj) return fields;

        // Get all fields of type 'File'
        const json = obj.toJSON();
        for (const key in json) {
            if (json[key] && json[key].__type === 'File') fields.push(key);
        }

        return fields;
    }

    private static deleteFile(filename: string) {
        Parse.Cloud.httpRequest({
            method: 'DELETE',
            url: `http://0.0.0.0:${process.env.NODE_PORT}/files/${filename}`,
            headers: { 'X-Parse-Master-Key': Parse.masterKey, 'X-Parse-Application-Id': Parse.applicationId },
        });
    }
    // endregion
}

export default Cloud;
