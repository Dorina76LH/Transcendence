'''
# =============================================================================
# SERIALIZERS - apps/users/serializers.py
#
# Serializers act as translators between JSON and Python objects.
#
# class NameSerializer(serializers.ModelSerializer)
# → creates a serializer from a django model
#
# JSON → Python (deserialization) : when Angular sends data to Django
#   - Validates incoming data (required fields, email unique, password strength)
#   - Transforms JSON into a Python object ready to save in the database
                                                                                                                                                                                                        #
# Python → JSON (serialization) : when Django sends data to Angular
#   - Transforms a Python/Django object into JSON
#   - Controls which fields are returned (e.g. never return the password)
#
# Validation levels :
#  - Level 1 - Automatic by DRF/ModelSerializer :
#     - Required fields present ?
#     - Correct types ? (email format, string length...)
#     - Constraints from the model (max_length, unique...)
#  - Level 2 - Custom validators added manually :
#     - validate_<fieldname>() : custom business rules (email unique in DB)
#     - validators=[...] : Django built-in validators (password strength)
#
# Flow : Angular → URL → View → Serializer → Model → Database
# =============================================================================
'''

#* =============================================================================
#* IMPORT
#* =============================================================================

# Import Django's built-in pwd validation rules -> method validate_password
# (minimum length, no too common, not too similar to username...)
from django.contrib.auth.password_validation import validate_password

# Import DRF serializers - the translators between JSON and Python
from rest_framework import serializers

# Import SimpleJWT's default login serializer to extend it with custom behavior
# (is_online update, user data in response)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Import custom User model to create and query users
from .models import User


#* ----------------------------------------------------------------------------
#* RegisterSerializer
#* ----------------------------------------------------------------------------
# Handles user registration - validates input and creates a new user in the database.
#
# FIELD BEHAVIOR:
# ---------------
#   1. Automatic: 'username' and 'email' are inferred from the User Model.
#   2. Redefined: 'password' (to add custom validation and hide it in responses).
#   3. Calculated: 'avatar_url' (does not exist in DB, generated on the fly).
#
# FLOW BETWEEN VIEW & SERIALIZER:
# -------------------------------
#   1. VIEW calls serializer.is_valid()  --> Triggers validate_email()
#   2. VIEW calls serializer.save()      --> Triggers create()
#   3. VIEW returns serializer.data      --> Triggers get_avatar_url()
#* ----------------------------------------------------------------------------

#? -----------------------------------------------------------------------------
#? PYTHON FLOW FOR BEGINNERS
#? -----------------------------------------------------------------------------
#?
#? DOES THE ORDER OF "def" MATTER?
#? ------------------------------
#?   NO! In Python classes, the order doesn't matter for execution.
#?   You can write create() before validate_email(), and it will still work.
#?   WHY? Because the VIEW is the conductor: it calls the methods only when 
#?   needed (e.g., it won't call create() until is_valid() has finished).
#?
#? WHY ARE THERE MULTIPLE "def" (METHODS)?
#? ---------------------------------------
#?   Each method is a specific "checkpoint" triggered at a precise moment:
#?
#?   1. validate_<field>() : THE SPECIALIST (Triggered by .is_valid())
#?      - Checks one specific field (ex: "Is this email already taken?").
#?
#?   2. create() : THE BUILDER (Triggered by .save())
#?      - Actually writes the user to the DB and hashes the password.
#?
#?   3. get_<field>() : THE DECORATOR (Triggered during JSON output)
#?      - Calculates values for "virtual" fields like avatar_url.
#?
#? WHO DOES WHAT? (VIEW VS SERIALIZER)
#? -----------------------------------
#?   1. VIEW: The "Manager" (Logic)
#?      - Receives the Request from Angular.
#?      - Tells the Serializer: "Hey, check if this data is valid."
#?      - If valid, tells the Serializer: "Okay, save it to the database."
#?      - Sends the final Response (201 Created or 400 Error) back to Angular.
#?
#?   2. SERIALIZER: The "Translator & Quality Control" (Data)
#?      - Translates JSON to Python.
#?      - Checks the quality (Email format, Password strength).
#?      - Actually writes the user to the Database via create().
#?
#?   - The VIEW is the "Conductor": it decides WHEN to validate or save.
#?   - The SERIALIZER is the "Expert": it knows HOW to validate or save.
#?
#? WHY USE write_only=True ON THE PASSWORD?
#? -----------------------------------------
#?   This is a CRITICAL security measure. 
#?   write_only means: "We accept it when Angular sends it (writing),
#?   but we NEVER include it in the JSON response (reading)."
#?
#? WHAT IS A SerializerMethodField?
#? --------------------------------
#?   It is a "virtual" field. It tells DRF: "Don't look for this field in 
#?   the database; I will provide the value via a specific function."
#?   By convention, DRF looks for a function named get_<field_name>.
#?
#? WHY FILTER THE EMAIL IN validate_email?
#? ---------------------------------------
#?   Even if the model has `unique=True`, performing validation in the serializer
#?   allows us to return a clean error (400 Bad Request) to Angular with a 
#?   user-friendly message, rather than a raw database constraint error.
#?
#? WHY USE create_user() INSTEAD OF create()?
#? ------------------------------------------
#?   If we use .create(), the password will be saved in "plain text" (ex: "123").
#?   Django will never be able to log the user in because it expects a hash.
#?   .create_user() is a special Django method that:
#?     1. Takes the raw password.
#?     2. "Scrambles" it (algorithmic hashing).
#?     3. Saves the unreadable result in the database.
#?
#? WHAT IS validated_data?
#? -----------------------
#?   It is the dictionary of data after it has passed all validation tests.
#?   Think of it as the "clean basket" ready to be stored in the database.
#? -----------------------------------------------------------------------------

class RegisterSerializer(serializers.ModelSerializer):

    #& STEP 1 : Special field specifications

    # Password validation 
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    # Get avatar from database -> @property method in USer model 
    avatar_url = serializers.SerializerMethodField()

    #& STEP 2 : Meta (Model and Fields to serialize)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'avatar_url')
    
    #& STEP 3 : Custom handlers (field getters, validators and object creation)
    
    """ Checkpoint 1 : triggered by is_valid() """
    def validate_email(self, value):
        # value = the email entered by the user
        # Checks that no other user already has this email in the database.
        # This rule is not automatic - DRF doesn't know it's required here.
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value
    
    """ Checkpoint 2 : triggered by save() """
    def create(self, validated_data):
        # create_user() is used instead of create() because it automatically
        # hashes the password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            # auto login
            is_active=True,
            is_online=True
        )
        return user
    
    """ Checkpoint 3 : triggered when returning data """
    def get_avatar_url(self, obj):
        """
        Calculates the avatar source:
        1. Checks if a file exists in the ImageField.
        2. If not, returns the DiceBear API string defined in the Model @property.
        """
        return obj.avatar_url



#* ----------------------------------------------------------------------------
#* UserSerializer
#* ----------------------------------------------------------------------------
# Handles user profile display (Read-Only).
# Used to return sanitized user information to Angular after login or for profile pages.
#
# WHY NO VALIDATION HERE?
# ------------------------
#   Since this serializer is used to SEND data (Python -> JSON), we trust the 
#   database. Validation is only critical when RECEIVING data (Register/Update).
#
# THE "SHAPE SORTER" CONCEPT:
# ---------------------------
#   The Serializer acts as a filter. Even if the User model has 20 fields 
#   (including sensitive ones like 'password'), this class ensures Angular 
#   ONLY receives the 6 fields defined in Meta.fields.
#* ----------------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    
    #& STEP 1 : Special Field Specifications
    
    # SerializerMethodField: DRF, don't look for 'avatar_url' in the DB columns.
    # DRF, looks for a method in THIS class named 'get_avatar_url'.
    avatar_url = serializers.SerializerMethodField()
    
    #& STEP 2 : Meta Definition
    class Meta:
        model = User
        # 'id', 'username', 'email', 'is_online', 'role' -> Injected directly from DB.
        # 'avatar_url' -> Injected from the method below.
        fields = ('id', 'username', 'email', 'avatar_url', 'is_online', 'role')
        # Safety: these cannot be modified via this serializer.
        read_only_fields = ('id', 'username', 'role')
    
    #& STEP 3 : Custom Handlers
    def get_avatar_url(self, obj):
        """
        Calculates the avatar source (calls the @property method defined in models.py):
        1. Checks if a file exists in the ImageField.
        2. If not, returns the DiceBear API string defined in the Model @property.
        """
        return obj.avatar_url

# -----------------------------------------------------------------------------
# NOTE : CustomTokenObtainPairSerializer commented out
# A LoginSerializer with the same logic already exists above (line ~240).
# It uses UserSerializer instead of a manual dict, which is more maintainable.
# Please compare both approaches and we can decide together which to keep.
# -----------------------------------------------------------------------------
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#
#         self.user.is_online = True
#         self.user.save(update_fields=["is_online"])
#
#         data["user"] = {
#             "id": self.user.id,
#             "username": self.user.username,
#             "email": self.user.email,
#             "avatar_url": self.user.avatar_url,
#             "is_online": self.user.is_online,
#             "role": self.user.role,
#         }
#         return data
    


#* ----------------------------------------------------------------------------
#* LoginSerializer (SimpleJWT Extension)
#* ----------------------------------------------------------------------------
# Extends SimpleJWT's default TokenObtainPairSerializer to add custom behavior :
#   - set is_online = True when user logs in
#   - return user info alongside the tokens
#
# WHY EXTEND TokenObtainPairSerializer?
# -------------------------------------
#   SimpleJWT already handles the "Supervisor" role (validate()):
#   1. Checks if user exists + checks hashed password.
#   2. Generates Access & Refresh JWT tokens.
#   3. We just "inject" our custom logic (is_online & user info) into the result.
# 
# WHAT DOES TokenObtainPairSerializer DO UNDER THE HOOD ?
# -------------------------------------------------------
#   When we call super().validate(attrs), the parent class secretly does :
#
#   1. Extracts username and password from attrs :
#      username = attrs['username']
#      password = attrs['password']
#
#   2. Looks up the user in the database :
#      user = User.objects.get(username=username)
#
#   3. Verifies the password against the hashed version in the database :
#      user.check_password(password)
#
#   4. Raises AuthenticationFailed automatically if :
#      - username does not exist in the database
#      - password does not match
#      - account is inactive (is_active = False)
#
#   5. If credentials are correct :
#      - stores the User object in self.user (accessible in our validate())
#      - generates access and refresh JWT tokens for this user
#      - returns { "access": "eyJ...", "refresh": "eyJ..." }
#* -----------------------------------------------------------------------------

#? -----------------------------------------------------------------------------
#? PYTHON FLOW FOR BEGINNERS
#? -----------------------------------------------------------------------------
#?
#? WHY EXTEND TokenObtainPairSerializer?
#? -------------------------------------
#?   SimpleJWT already handles the "Supervisor" role (validate()):
#?   1. Checks if user exists + checks hashed password.
#?   2. Generates Access & Refresh JWT tokens.
#?   3. We just "inject" our custom logic (is_online & user info) into the result.
#?
#? WHAT IS A DICTIONARY ?
#? ----------------------
#?   A dictionary is a collection of key:value pairs, like a drawer with labels :
#?   drawer = {
#?       "firstname" : "Antoine",    # label : content
#?       "age"       : 25,          # label : content
#?       "city"      : "Paris",     # label : content
#?   }
#?   To access the content : drawer["firstname"] → "Antoine"
#?
#? WHY DOES DJANGO USE DICTIONARIES ?
#? ----------------------------------
#?   Because JSON IS a dictionary - it is exactly the same structure :
#?   Python dict : {"access": "eyJ...", "refresh": "eyJ..."}
#?   JSON        : {"access": "eyJ...", "refresh": "eyJ..."}
#?   DRF automatically converts the Python dictionary to JSON for Angular.
#?
#? WHY EXTEND INSTEAD OF REWRITE ?
#? -------------------------------
#?   TokenObtainPairSerializer already handles the heavy lifting :
#?   - checks username/password against the database
#?   - raises an exception automatically if credentials are wrong
#?   - generates access and refresh tokens
#?   We just add our custom behavior on top with super().validate()
#?
#? WHAT IS super().validate(attrs) ?
#? ---------------------------------
#?   super() = the parent class (TokenObtainPairSerializer)
#?   .validate(attrs) = its validation method
#?   attrs = raw incoming data : { "username": "...", "password": "..." }
#?   Calling super().validate() means : "do your usual work first, I'll add mine after"
#?   Returns : { "access": "eyJ...", "refresh": "eyJ..." }
#?
#? WHAT IS self.user ?
#? -------------------
#?   Automatically set by the parent class after successful validation.
#?   It is the full Django User object retrieved from the database.
#?   We can access any field : self.user.is_online, self.user.username...
#?
#? WHAT IS update_fields ?
#? -----------------------
#?   save() without update_fields rewrites the entire user row in the database.
#?   save(update_fields=['is_online']) only updates this one column → optimization.
#?
#? WHAT IS UserSerializer(self.user).data ?
#? ----------------------------------------
#?   UserSerializer(self.user) → creates a serializer instance with our User object
#?   .data → triggers the serialization → transforms User object into JSON dict
#?
#? WHAT IS data['user'] = UserSerializer(self.user).data ?
#? -------------------------------------------------------
#?   It is three things in one line :
#?   1. UserSerializer(self.user) → creates a serializer instance with our User object
#?   2. .data → triggers serialization = transforms User Python object into JSON dict
#?   3. data['user'] = → adds this dict to data under the key 'user'
#?   This key name is a CONTRACT between Django and Angular :
#?   Django  : data['user'] = UserSerializer(self.user).data
#?   Angular : response.user.username  ← must match exactly
#?   If Django writes data['profil'] but Angular reads response.user → undefined !
#? 
#? FINAL RESPONSE TO ANGULAR :
#? ---------------------------
#?   {
#?     "access"  : "eyJ...",        ← short-lived token for API requests
#?     "refresh" : "eyJ...",        ← long-lived token to get a new access token
#?     "user"    : {                ← user info formatted by UserSerializer
#?       "id"        : 1,
#?       "username"  : "...",
#?       "email"     : "...",
#?       "avatar_url": "...",
#?       "is_online" : true,
#?       "role"      : "user"
#?     }
#?   }
#?
#? FLOW :
#? ------
#?   Angular → LoginView → LoginSerializer.validate()
#?     → super().validate() : checks credentials, generates tokens
#?     → is_online = True saved in database
#?     → UserSerializer formats user data
#?     → returns tokens + user data to Angular
#? -----------------------------------------------------------------------------

class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # Call parent validate() to check credentials and generate tokens
        data = super().validate(attrs)

        # self.user is set by parent after successful validation
        # Update is_online in the database
        self.user.is_online = True
        self.user.save(update_fields=['is_online'])

        # Add user info to the response alongside the tokens
        data['user'] = UserSerializer(self.user).data

        return data



#* ----------------------------------------------------------------------------
#* LogoutSerializer
#* ----------------------------------------------------------------------------
