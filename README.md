Pending Updates:

Database changes:

1.  Users:

	 Address will be divided for all:
		 streetAddress: { type: String, required: true },
 		 addressLine2: { type: String },
  		city: { type: String, required: true },
  		state: { type: String, required: true }, 
  		postalCode: { type: String, required: true }, //6 digits only
  		country: { type: String, required: true }
        
	while displaying we can concatenate all these fields
	this address will be same for both user and organisation
________________________________________________________________________
if user is organaisation, there will be some extra field
_________________________________________________________________________

**********************************************************************************************

2. drives: 

replace the location schema with schema of address as mentioned above
 
	add two more veriable
		 geoLocation: {
   			 latitude: { type: Number, required: true },
    			longitude: { type: Number, required: true }
 		 },
	
		  placeLink: { type: String } // Optional field for Google Maps link
		
*******************************************************************************************

3. DonationRequests

Change the address schema as shown earlier
________________________________________
add variable to store status change timestamp 
________________________________________
add variable to store ID of admin who changes the status (i.e from default pending to accept or reject)
____________________________________________________________________________________
add variable to store the status note (i.e admin can add note why rejected) //keep as optionl 

suggested schema:
        model DonationRequests {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  fullname        String
  mobile          String
  email           String
  address         String
  type            String
  quantity        String
  status          String   @default("Pending") // Possible values: "Pending", "Accepted", "Rejected"
  statusChangedAt DateTime?                     // Timestamp when the status was last updated
  statusChangedBy String?  @db.ObjectId         // ID of the admin who changed the status
  statusNote      String?                       // Optional note explaining the status change
  createdAt       DateTime @default(now())
}
----------------------------------------------------------------------------------------------------
4. create model to accept money donations

 Important variables: 

   transaction ID (required)
   amount (required)
   Type (UPI/ Net banking) (required)

***********************************************************5. create certificate model
    userID
    certificate ID
    Type (cycle /money...)
    description 


*******************************************************************************************
		
6. User bashboard----> 
on dashboard---->add contributions, total 


sidebar

profile
Add view Donation History
add Download certificate 
Donate 
logout

                    
			