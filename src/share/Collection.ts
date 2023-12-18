export class collectionType {
    Entity = "";
    Definition = "";
    URL: string[] = [];
    Metadata: meta = new meta();
    Entities: string[] = [];

    SetContent(object: any) {
        this.Entity = object.Entity;
        this.Definition = object.Definition;
        this.URL = object.URL;
        this.Metadata = object.Metadata;
        this.Entities = object.Entities;
    }

    Reset() {
        this.Entity = "";
        this.Definition = "";
        this.URL = [];
        this.Metadata = new meta();
        this.Entities = [];
    }
}

class meta {
    Identifier = "";
    Type = "";
}
