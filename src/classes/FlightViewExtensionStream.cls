public without sharing class FlightViewExtensionStream {
	
    ApexPages.StandardController controller;
    Flight__c flight;
    
    public FlightViewExtensionStream(ApexPages.StandardController controller) {
        this.controller = controller;
        controller.addFields(new List<String>{
            SObjectType.Flight__c.fields.Name.Name,
            SObjectType.Flight__c.fields.PushTopicId__c.Name
        });
        this.flight = (Flight__c)controller.getRecord();
    }
    
    public void insertPushTopic() {
        if (null != this.flight.PushTopicId__c) return;
        
        PushTopic pushTopic = new PushTopic(
            Name                = flight.Name + '.Commands',
            Query               = 'SELECT Id, Name FROM Command__c WHERE Flight__c = \'' + this.controller.getId() + '\'',
            ApiVersion          = 27.0,
            NotifyForOperations = 'Create',
            NotifyForFields     = 'Select'
        );
        insert pushTopic;
        
        this.flight.PushTopicId__c = pushTopic.Id;
        update this.flight;
    }
    
    public String getPushTopicName() {
        PushTopic pushTopic = [
            SELECT Name
            FROM PushTopic
            WHERE Id = :this.flight.PushTopicId__c
        ];
        //System.assert(false, pushTopic);
        return pushTopic.Name;
    }
    
}