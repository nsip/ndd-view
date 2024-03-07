export class entityType {
    Entity = "";
    OtherNames: string[] = [];
    Definition: def[] = [];
    SIF: sif[] = [];
    OtherStandards: otherStd[] = [];
    LegalDefinitions: legalDef[] = [];
    Sensitivity: sensitivity[] = [];
    Collections: col[] = [];
    Metadata: meta = new meta();

    SetContent(object: any) {
        this.Entity = object.Entity;
        this.OtherNames = object.OtherNames;
        this.Definition = object.Definition;
        this.SIF = object.SIF;
        this.OtherStandards = object.OtherStandards;
        this.LegalDefinitions = object.LegalDefinitions;
        this.Sensitivity = object.Sensitivity;
        this.Collections = object.Collections;
        this.Metadata = object.Metadata;
    }

    Reset() {
        this.Entity = "";
        this.OtherNames = [];
        this.Definition = [];
        this.SIF = [];
        this.OtherStandards = [];
        this.LegalDefinitions = [];
        this.Sensitivity = [];
        this.Collections = [];
        this.Metadata = new meta();
    }
}

class def {
    Text = "";
    Scope = "";
}

class sif {
    XPath: string[] = [];
    Definition = "";
    Commentary = "";
    Datestamp = "";
}

class otherStd {
    Standard = "";
    Link: string[] = [];
    Path: string[] = [];
    Definition = "";
    Commentary = "";
}

class legalDef {
    LegislationName = "";
    Citation = "";
    Link = "";
    Definition = "";
    Commentary = "";
    Datestamp = "";
}

class sensitivity {
    Locale = "";
    Value = "";
    Commentary = "";
}

class col {
    Name = "";
    Description = "";
    Standard = "";
    Elements: string[] = [];
    BusinessRules: string[] = [];
    DefinitionModification = "";
}

class meta {
    Identifier = "";
    Type = "";
    ExpectedAttributes: string[] = [];
    SuperClass = "";
    IsAttributeOf: string[] = [];
    CrossRefEntities: string[] = [];
}
