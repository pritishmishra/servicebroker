var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));

// This is invoked by the Cloud Foundry Runtime, during service broker creation
// & marketplace search
app.get('/v2/catalog', function(req, res){
	res.status(200).json(
		{
   "services":[
      {
	 "id":"demo-service-id",
         "name":"demo-as-a-service",
         "description":"this is a demo service",
	 "bindable": true,
         "requires":[],
         "tags":["demo","testing"],
         "metadata":{
            "displayName":"Demo service broker",
            "longDescription":"this is a demo service broker",
            "providerDisplayName":"Pritish Mishra"
         },
         "plans":[
            {
               "id":"024f3452-67f8-40bc-a724-a20c4ea24b1c",
		"name":"simple-broker-planr",
               "description":"A small-sized plan",
               "metadata":{
                  "bullets":["20 calculations","20 operations"],
                  "costs":[
                     {
                        "amount":{
                           "usd":99.0,
                           "eur":49.0
                        },
                        "unit":"MONTHLY"
                     },
                     {
                        "amount":{
                           "usd":0.99,
                           "eur":0.49
                        },
                        "unit":"1GB of messages over 20GB"
                     }
                  ],
                  "displayName":"Genius Plan"
               }
            }
         ]
      }
   ]
}
		
		);
	
});

var server = app.listen(process.env.PORT || 8002, function () {
	console.log('Service Broker running');
});

// Endpoint invoked by Cloud Foundry when a service instance is created (cf
// create-service)
app.put('/v2/service_instances/:id', function(req, res){res.status(201).json({})});

// Endpoint invoked by Cloud Foundry if the service instance is upgraded (plan
// upgrades etc)
app.patch('/v2/service_instances/:id', function(req, res){res.status(200).json({})});

// Endpoint invoked by Cloud Foundry when an app is bound to a service instance
// (cf bind-service)
app.put('/v2/service_instances/:instance_id/service_bindings/:binding_id', function(req,res){
	res.status(200).json({
		credentials: {
			url: process.env.serviceurl,
			user: 'dummy',
			password: 'dummy'
		}
	})
});

// Endpoint invoked by Cloud Foundry when a service binding is deleted (cf
// unbind-service)
app.delete('/v2/service_instances/:instance_id/service_bindings/:binding_id', function(req, res){
	res.status(200).json({});
});

// Endpoint invoked by Cloud Foundry when a service instance is deleted (cf
// delete-service)
app.delete('/v2/service_instances/:instance_id', function(req, res){
	res.status(200).send({});
});
