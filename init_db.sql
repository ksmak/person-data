INSERT INTO "Subscription"(
    id,
    title, 
    "maxQueriesDay", 
    "maxQueriesMonth", 
    "maxQueriesTotal", 
    "usageTimeLimit", 
    "accessImportData",
    "accessUsers",
    "accessMonitoring"
) VALUES (
    '49cfd3cf-9141-4e7b-9e8f-d346609a0b04',
    'test',
    100,
    1000,
    5000,
    3,
    false,
    false,
    false
);

INSERT INTO "User"(
    id,
    "isActive",
    "login",
    "password",
    "firstName", 
    "lastName", 
    "middleName", 
    "expiredPwd",
    "subsId"
) VALUES (
    '093ad259-7217-4e69-aa3e-c4fd02fc92ba',
    true,
    'user1',
    '12345',
    'Ахмет',
    'Ахметов',
    'Ахметович',
    '01.01.2025',
    '49cfd3cf-9141-4e7b-9e8f-d346609a0b04'
);

INSERT INTO "User"(
    id,
    "isActive",
    "login",
    "password",
    "firstName", 
    "lastName", 
    "middleName", 
    "expiredPwd",
    "subsId"
) VALUES (
    'cc0221cf-9d33-4c84-8b40-981d15ab1b31',
    true,
    'user2',
    '12345',
    'Самат',
    'Саматов',
    'Саматович',
    '01.01.2025',
	'49cfd3cf-9141-4e7b-9e8f-d346609a0b04'
);

INSERT INTO "User"(
    id,
    "isActive",
    "login",
    "password",
    "firstName", 
    "lastName", 
    "middleName", 
    "expiredPwd",
    "subsId"
) VALUES (
    '07466fa3-19ba-46a1-8d63-d0d12967c6d8',
    true,
    'user3',
    '12345',
    'Алихан',
    'Алиханов',
    'Алиханович',
    '01.01.2025',
    '49cfd3cf-9141-4e7b-9e8f-d346609a0b04'
);
INSERT INTO "Db" (
   id,
   name
) VALUES (
   '154b0455-9ce3-4622-b1cd-5a9d3f05be65',
   'TEST'
)