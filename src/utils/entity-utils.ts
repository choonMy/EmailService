
type RecordTypeString<T> = {
    [P in keyof T]: string;
};

export type EntityTypeString<T> = RecordTypeString<T> & { tableName: string }