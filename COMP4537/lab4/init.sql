CREATE TABLE IF NOT EXISTS Patients (
    patientid int auto_increment not null,
    name varchar(100) not null,
    dateOfBirth datetime not null,
    primary key (patientid)
);