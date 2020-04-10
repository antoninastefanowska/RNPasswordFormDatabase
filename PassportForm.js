class PassportForm {
    constructor(
        id,
        date,
        name,
        surname,
        pesel,
        sex,
        isMale,
        email,
        phone,
        birthDay,
        birthMonth,
        birthYear,
        rodo,
        file
    ) {
        this.id = id ? id : null;
        this.date = date ? date : null;
        this.name = name ? name : "";
        this.surname = surname ? surname : "";
        this.pesel = pesel ? pesel : "";
        this.sex = sex ? sex : "male";
        this.isMale = isMale ? isMale : true;
        this.email = email ? email : "";
        this.phone = phone ? phone : "";
        this.birthDay = birthDay ? birthDay : 1;
        this.birthMonth = birthMonth ? birthMonth : 1;
        this.birthYear = birthYear ? birthYear : 1995;
        this.rodo = rodo ? rodo : false;
        this.file = file ? file : null;
    }
}

export default PassportForm