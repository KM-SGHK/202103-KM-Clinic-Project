1. Architectural Design of the Project
i.	Please refer to this diagram, https://drive.google.com/file/d/1rB6gyoUOF2NG8XmTIbw4Li3Napp7zQ5Z/view?usp=sharing 

2. Steps for running the app\
i.	App\
    a.	yarn install\
    b.	cd reactNative/AwesomeProject\
    c.	yarn start <br />
ii.	Backend\
    a.	yarn install\
    b.	cd server\
    c.	yarn ts-node main.ts\
iii.	Login Account:\
    a.	“User Email”: Kwong@gmail.com\
    b.	“Password”: 1234

3. Login Mechanism\
i.	Security measures\
    a.	Password is hashed through bcrypt.\
    b.	JWT is acquired in authorization process, and token is generated at backend server, and then sent to frontend client for local storage.\
    c.	Route guard has been set at backend, to prevent non-logged-in users from fetching clinic record data.\
ii.	“User Email” from each clinic is made unique, and checking will be done at backend whenever the user tries to log in. \
iii.	For log-in case, error messages will be shown if password and user email are incorrect.\
iv.	To create a log-in account, the users need to fill in all the sign-up form fields. Otherwise, error message will be shown, and the submit button will be disabled.

4. Database\
i.	MySQL is the primary database used in this project for storing data. The project is connected to the database on MySQL Workbench.\
ii.	APIs connecting to MongoDB for sign-up and sign-in processes are also prepared for your reference. The database is connected through MongoDB compass.

5. APIs\
i.	Except the API on saving clinic record, all the three other APIs for sign-up, sign-in and getting clinic records are supported with UI.\
ii.	To test the API on saving clinic record, please do so on Postman, with the following url: http://localhost:8080/recordSaving/Kwong@gmail.com

6. Data\
i.	Only records from the clinic which logs in will be loaded at Clinic Record Screen.\
ii.	Dates on the calendar on Clinic Record Screen are marked in red. The data shown in the overlay table when clicking the date is ordered by data id.\
iii. Some dates are with multiple records.

7. Frontend State Management\
i.	React Context and Redux are used for state management in and after the log-in process.\
ii.	The user info. Stored in the state is used for fetching clinic record data, when the record screen is loaded.
