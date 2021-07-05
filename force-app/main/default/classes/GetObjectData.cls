public with sharing class GetObjectData 
{
    @AuraEnabled
    public static List<sObject> getData(String objectType)
    {
        //getting all data acording to user
        SObjectType sObjType = ((SObject) Type.forName(objectType).newInstance()).getSObjectType();
        DescribeSObjectResult describeResult = sObjType.getDescribe();

        List<String> fields = new List<String>( describeResult.fields.getMap().keySet() );

        String query =' SELECT ' +String.join( fields, ',' ) +' FROM ' +describeResult.getName();
        List<SObject> newData = Database.query( query );
        System.debug( newData );
        return newData;
    }

    @AuraEnabled
    public static void deleteObject(List<sObject> objectList , String objectType)
    {
        //for deleting data
        System.debug(objectList);
        System.debug(objectType);
        //List<sObject> k = database.query('Select fields(standard) '+'From '+objectType+' WHERE Id In '+objectList); 
        //System.debug(k);
        delete objectList;
    }

    @AuraEnabled
    public static List<String> getSobject()
    {
        //getiing list of objects
        Map<String, Schema.SObjectType> sObjectMap = Schema.getGlobalDescribe(); 
        List <String> sobjectList = new List <String>(sObjectMap.keyset());
        return sobjectList;
    }

    @AuraEnabled
    public static List<String> getEditableFields(String objectType)
    {
        //getting editable fields
        Map<String, Schema.SObjectField> oppFields = Schema.getGlobalDescribe().get(objectType).getDescribe().fields.getMap();
        
        list<string> editableFields = new list<string> ();
        
        for(schema.SObjectField editfieds :oppFields.values()){
            
        schema.DescribeFieldResult fieldResult = editfieds.getDescribe();
            
            if(fieldResult.isUpdateable()){
                
                editableFields.add(fieldResult.getName());
                
                List <String> oppList = new List<String>(editableFields);
            
                }
            }
            editableFields.sort();
            system.debug(editableFields);
            return editableFields;    
    }
}
