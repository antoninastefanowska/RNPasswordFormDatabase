import React, { Component } from 'react';
import { View, Text, TextInput, Button, Picker, ScrollView } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import DatePicker from '../custom/DatePicker/DatePicker';
import Style from '../Style';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const DIGITS_ONLY_REGEX = /^[0-9]*$/;
const LETTERS_ONLY_REGEX = /^[A-Za-z\-]*$/;

export const ERROR_MESSAGES = {
    date: "Data wymagana.",
    name: "Prawidłowe imię wymagane.",
    surname: "Prawidłowe nazwisko wymagane.",
    pesel: "Prawidłowy pesel wymagany.",
    email: "Prawidłowy adres e-mail wymagany.",
    phone: "Nieprawidłowy numer telefonu.",
    rodo: "Wymagana zgoda."
};

class FormView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passportForm: this.props.route.params.passportForm,
            mode: this.props.route.params.mode,

            errors: {
                date: this.isDateValid(this.props.route.params.passportForm.date) ? "" : ERROR_MESSAGES.date,
                name: this.isNameValid(this.props.route.params.passportForm.name) ? "" : ERROR_MESSAGES.name,
                surname: this.isNameValid(this.props.route.params.passportForm.surname) ? "" : ERROR_MESSAGES.surname,
                pesel: this.isPeselValid(this.props.route.params.passportForm.pesel) ? "" : ERROR_MESSAGES.pesel,
                email: this.isEmailValid(this.props.route.params.passportForm.email) ? "" : ERROR_MESSAGES.email,
                rodo: this.isRodoValid(this.props.route.params.passportForm.rodo) ? "" : ERROR_MESSAGES.rodo,
                phone: this.isPhoneValid(this.props.route.params.passportForm.phone) ? "" : ERROR_MESSAGES.phone
            },

            maxDays: this.getMaxDays(1, 1995),
            isDatePickerVisible: false
        };
    }

    render() {
        return (
            <View style={Style.container}>
                <ScrollView>
                    <View style={Style.elementContainer}>
                        <DatePicker style={Style.input} value={this.state.passportForm.date ? this.textToDate(this.state.passportForm.date) : new Date()} title="Wybierz datę" onDateChanged={(event, selectedDate) => this.onDateChanged(this, event, selectedDate)} />
                        {this.state.errors.date !== "" && (
                            <Text style={Style.error}>{this.state.errors.date}</Text>
                        )}
                    </View>

                    <View style={Style.elementContainer}>
                        <Text style={Style.label}>Imię</Text>
                        <TextInput style={Style.input} autoCapitalize="words" value={this.state.passportForm.name} onChangeText={(text) => this.onNameTextChanged(this, text)} />
                        {this.state.errors.name !== "" && (
                            <Text style={Style.error}>{this.state.errors.name}</Text>
                        )}
                    </View>

                    <View style={Style.elementContainer}>
                        <Text style={Style.label}>Nazwisko</Text>
                        <TextInput style={Style.input} autoCapitalize="words" value={this.state.passportForm.surname} onChangeText={(text) => this.onSurnameTextChanged(this, text)} />
                        {this.state.errors.surname !== "" && (
                            <Text style={Style.error}>{this.state.errors.surname}</Text>
                        )}
                    </View>

                    <View style={Style.elementContainer}>
                        <Text style={Style.label}>PESEL</Text>
                        <TextInput style={Style.input} keyboardType="number-pad" maxLength={11} value={this.state.passportForm.pesel} onChangeText={(text) => this.onPeselTextChanged(this, text)} />
                        {this.state.errors.pesel !== "" && (
                            <Text style={Style.error}>{this.state.errors.pesel}</Text>
                        )}
                    </View>

                    <View style={Style.elementContainer}>
                        <Text style={Style.label}>Płeć</Text>
                        <RadioButton.Group value={this.state.sex} onValueChange={(value) => this.onSexRadioButtonChanged(this, value)}>
                            <View style={Style.horizontalContainer}>
                                <RadioButton style={Style.radioButton} value="male" status={this.state.passportForm.isMale ? 'checked' : 'unchecked'} />
                                <Text style={Style.smallLabel}>M</Text>
                            </View>

                            <View style={Style.horizontalContainer}>
                                <RadioButton style={Style.radioButton} value="female" status={!this.state.passportForm.isMale ? 'checked' : 'unchecked'} />
                                <Text style={Style.smallLabel}>K</Text>
                            </View>
                        </RadioButton.Group>
                    </View>

                    <View style={Style.elementContainer}>
                        <Text style={Style.label}>Adres e-mail</Text>
                        <TextInput style={Style.input} autoCapitalize="none" value={this.state.passportForm.email} onChangeText={(text) => this.onEmailTextChanged(this, text)} />
                        {this.state.errors.email !== "" && (
                            <Text style={Style.error}>{this.state.errors.email}</Text>
                        )}
                    </View>

                    <View style={Style.elementContainer}>
                        <Text style={Style.label}>Numer telefonu</Text>
                        <TextInput style={Style.input} keyboardType="phone-pad" value={this.state.passportForm.phone} onChangeText={(text) => this.onPhoneTextChanged(this, text)} />
                        {this.state.errors.phone !== "" && (
                            <Text style={Style.error}>{this.state.errors.phone}</Text>
                        )}
                    </View>

                    <View style={Style.elementContainer}>
                        <Text style={Style.label}>Data urodzenia</Text>
                        <View style={Style.elementContainer}>
                            <Text style={Style.label}>Dzień</Text>
                            <Picker style={Style.input} selectedValue={this.state.passportForm.birthDay} onValueChange={(itemValue, itemPosition) => this.onBirthDatePickerChanged(this, itemValue, "birthDay")}>
                                {this.createNumberOptions(1, this.state.maxDays)}
                            </Picker>

                            <Text style={Style.label}>Miesiąc</Text>
                            <Picker style={Style.input} selectedValue={this.state.passportForm.birthMonth} onValueChange={(itemValue, itemPosition) => this.onBirthDatePickerChanged(this, itemValue, "birthMonth")}>
                                <Picker.Item value={1} label="Styczeń" />
                                <Picker.Item value={2} label="Luty" />
                                <Picker.Item value={3} label="Marzec" />
                                <Picker.Item value={4} label="Kwiecień" />
                                <Picker.Item value={5} label="Maj" />
                                <Picker.Item value={6} label="Czerwiec" />
                                <Picker.Item value={7} label="Lipiec" />
                                <Picker.Item value={8} label="Sierpień" />
                                <Picker.Item value={9} label="Wrzesień" />
                                <Picker.Item value={10} label="Październik" />
                                <Picker.Item value={11} label="Listopad" />
                                <Picker.Item value={12} label="Grudzień" />
                            </Picker>

                            <Text style={Style.label}>Rok</Text>
                            <Picker style={Style.input} selectedValue={this.state.passportForm.birthYear} onValueChange={(itemValue, itemPosition) => this.onBirthDatePickerChanged(this, itemValue, "birthYear")}>
                                {this.createNumberOptions(1920, 2002)}
                            </Picker>

                        </View>
                    </View>

                    <View style={Style.elementContainer}>
                        <View style={Style.horizontalContainer}>
                            <Checkbox status={this.state.passportForm.rodo ? "checked" : "unchecked"} onPress={() => this.onRodoCheckboxPressed(this)} />
                            <Text style={Style.smallLabel}>Zgadzam się na przetwarzanie moich danych osobowych.</Text>
                        </View>
                        {this.state.errors.rodo !== "" && (
                            <Text style={Style.error}>{this.state.errors.rodo}</Text>
                        )}
                    </View>

                    <View style={Style.elementContainer}>
                        <Button style={Style.input} title="Dodaj załącznik" onPress={() => this.onPickFileButtonPressed(this)} />
                    </View>

                    <View style={Style.elementContainer}>
                        <Button style={Style.input} disabled={!this.isFormValid(this.state.errors)} title="Wyślij" onPress={() => this.onSubmitButtonPressed(this)} />
                    </View>
                </ScrollView>
            </View>
        );
    }

    onDateChanged(context, event, selectedDate) {
        let newPassportForm = context.state.passportForm;
        let newErrors = context.state.errors;

        newPassportForm.date = selectedDate ? context.dateToText(selectedDate) : null;
        if (!context.isDateValid(selectedDate))
            newErrors.date = ERROR_MESSAGES.date;
        else
            newErrors.date = "";

        if (event.type === "set")
            context.updateStateProperties(
                {name: "errors", value: newErrors},
                {name: "passportForm", value: newPassportForm});
        else
            context.updateStateProperties(
                {name: "errors", value: newErrors});
    }

    onNameTextChanged(context, text) {
        let newPassportForm = context.state.passportForm;
        let newErrors = context.state.errors;

        newPassportForm.name = text;
        if (!context.isNameValid(text))
            newErrors.name = ERROR_MESSAGES.name;
        else
            newErrors.name = "";
        context.updateStateProperties(
            {name: "errors", value: newErrors},
            {name: "passportForm", value: newPassportForm}
        );
    }

    onSurnameTextChanged(context, text) {
        let newPassportForm = context.state.passportForm;
        let newErrors = context.state.errors;

        newPassportForm.surname = text;
        if (!context.isNameValid(text))
            newErrors.surname = ERROR_MESSAGES.surname;
        else
            newErrors.surname = "";
        context.updateStateProperties(
            {name: "errors", value: newErrors},
            {name: "passportForm", value: newPassportForm}
        );
    }

    onPeselTextChanged(context, text) {
        let newPassportForm = context.state.passportForm;
        let newErrors = context.state.errors;

        newPassportForm.pesel = text;
        if (!context.isPeselValid(text))
            newErrors.pesel = ERROR_MESSAGES.pesel;
        else {
            newErrors.pesel = "";
            let isMale = context.getIsMaleFromPesel(text);
            let sex = isMale ? "male" : "female";

            newPassportForm.birthDay = context.getDayFromPesel(text);
            newPassportForm.birthMonth = context.getMonthFromPesel(text);
            newPassportForm.birthYear = context.getYearFromPesel(text);
            newPassportForm.isMale = isMale;
            newPassportForm.sex = sex;
            newPassportForm.pesel = text;
        }
        context.updateStateProperties(
            {name: "errors", value: newErrors}, 
            {name: "passportForm", value: newPassportForm});
    }

    onSexRadioButtonChanged(context, value) {
        let newPassportForm = context.state.passportForm;
        let isMale = value === "male";
        newPassportForm.isMale = isMale;
        newPassportForm.sex = value;
        context.updateStateProperty('passportForm', newPassportForm);
    }

    onEmailTextChanged(context, text) {
        let newPassportForm = context.state.passportForm;
        let newErrors = context.state.errors;

        newPassportForm.email = text;
        if (!context.isEmailValid(text))
            newErrors.email = ERROR_MESSAGES.email;
        else
            newErrors.email = "";
        context.updateStateProperties(
            {name: "errors", value: newErrors},
            {name: "passportForm", value: newPassportForm}
        );        
    }

    onPhoneTextChanged(context, text) {
        let newPassportForm = context.state.passportForm;
        let newErrors = context.state.errors;

        newPassportForm.phone = text;
        if (!context.isPhoneValid(text))
            newErrors.phone = ERROR_MESSAGES.phone;
        else
            newErrors.phone = "";
        context.updateStateProperties(
            {name: "errors", value: newErrors},
            {name: "passportForm", value: newPassportForm}
        )
    }

    onBirthDatePickerChanged(context, itemValue, name) {
        let newPassportForm = context.state.passportForm;
        let value = parseInt(itemValue);

        newPassportForm[name] = value;
        if (name === "birthMonth") {
            let maxDays = this.getMaxDays(value, context.state.birthYear);
            context.updateStateProperties(
                {name: "passportForm", value: newPassportForm},
                {name: "maxDays", value: maxDays}
            );
        } else if (name === "birthYear") {
            let maxDays = this.getMaxDays(context.state.birthMonth, value);
            context.updateStateProperties(
                {name: "passportForm", value: newPassportForm},
                {name: "maxDays", value: maxDays}
            );
        } else
            context.updateStateProperty("passportForm", newPassportForm);
    }

    async onPickFileButtonPressed(context) {
        let result;
        let permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (!permission.granted) {
            permission = await ImagePicker.requestCameraRollPermissionsAsync({base64: false, exif: false});
            if (permission.granted) {
                result = await ImagePicker.launchImageLibraryAsync();
                if (!result.cancelled) {
                    let newPassportForm = context.state.passportForm;
                    newPassportForm.file = result.uri.toString();
                    context.updateStateProperty("passportForm", newPassportForm);
                }
            }
        } else {
            result = await ImagePicker.launchImageLibraryAsync();
            if (!result.cancelled) {
                let newPassportForm = context.state.passportForm;
                newPassportForm.file = result.uri.toString();
                context.updateStateProperty("passportForm", newPassportForm);
            }
        }
    }

    onRodoCheckboxPressed(context) {
        let newPassportForm = context.state.passportForm;
        let newErrors = context.state.errors;
        let value = !newPassportForm.rodo;
        
        newPassportForm.rodo = value;
        if (!context.isRodoValid(value))
            newErrors.rodo = ERROR_MESSAGES.rodo;
        else
            newErrors.rodo = "";
        context.updateStateProperties(
            {name: "errors", value: newErrors},
            {name: "passportForm", value: newPassportForm}
        );
    }

    onSubmitButtonPressed(context) {
        context.props.navigation.navigate('Result', {
            passportForm: context.state.passportForm,
            mode: context.state.mode
        });
    }

    isFormValid(errors) {
        for (let key of Object.keys(errors))
            if (errors[key] !== "")
                return false;
        return true;
    }

    isDateValid(value) {
        if (value == null)
            return false;
        if (value === "")
            return false;
        return true;
    }
    
    isNameValid(value) {
        if (value.length == 0)
            return false;
        if (!LETTERS_ONLY_REGEX.test(value))
            return false;
        return true;
    }

    isPeselValid(value) {
        if (value.length != 11)
            return false;
        if (!DIGITS_ONLY_REGEX.test(value))
            return false;

        let yearRaw = parseInt(value.substr(0, 2));
        let monthRaw = parseInt(value.substr(2, 2));
        let day = parseInt(value.substr(4, 2));
        let sumDigit = parseInt(value.charAt(10));

        let century = this.getCenturyFromPeselMonth(monthRaw);
        if (century == -1)
            return false;
        
        let year = this.centuryToYear(century, yearRaw);
        let month = monthRaw - this.getMonthSurplusFromPeselYear(year);
        let maxDay = this.getMaxDays(month, year);

        if (day < 1 || day > maxDay)
            return false;

        let sum = 0;
        for (let i = 0; i < 10; i++) {
            let digit = parseInt(value.charAt(i));
            let multiplier;
            switch (i % 4) {
                case 0:
                    multiplier = 9;
                    break;
                case 1:
                    multiplier = 7;
                    break;
                case 2:
                    multiplier = 3;
                    break;
                case 3:
                    multiplier = 1;
                    break;
            }
            sum += multiplier * digit;
        }

        if (sum % 10 != sumDigit)
            return false;

        return true;
    }

    isEmailValid(value) {
        if (value.length == 0)
            return false;
        if (!EMAIL_REGEX.test(value))
            return false;
        return true;
    }

    isPhoneValid(value) {
        if (value.length > 0) {
            if (value.length != 9)
                return false;
            if (!DIGITS_ONLY_REGEX.test(value))
                return false;
        }
        return true;
    }

    isRodoValid(value) {
        return value;
    }

    createNumberOptions(min, max) {
        let items = [];
        for (let i = min; i <= max; i++)
            items.push(<Picker.Item label={i.toString()} value={i} key={i} />);
        return items;
    }

    createErrorList(errors) {
        let items = [];
        for (let key of Object.keys(errors))
            items.push(<Text style={Style.error}>{errors[key]}</Text>);
        return items;
    }

    updateStateProperty(property, value) {
        let newState = this.state;
        newState[property] = value;
        this.setState(newState);
    }

    updateStateProperties(...properties) {
        let newState = this.state;
        for (let i = 0; i < properties.length; i++)
            newState[properties[i].name] = properties[i].value;
        this.setState(newState);
    }

    getMaxDays(month, year) {
        switch (month) {
            case 1:
                return 31;
            case 2:
                return year % 4 == 0 ? 29 : 28;
            case 3:
                return 31;
            case 4:
                return 30;
            case 5:
                return 31;
            case 6:
                return 30;
            case 7:
                return 31;
            case 8:
                return 31;
            case 9:
                return 30;
            case 10:
                return 31;
            case 11:
                return 30;
            case 12:
                return 31;
        }
        return 0;
    }

    getMonthSurplusFromPeselYear(year) {
        if (year >= 1800 && year < 1900)
            return 80;
        else if (year >= 1900 && year < 2000)
            return 0;
        else if (year >= 2000 && year < 2100)
            return 20;
        else if (year >= 2100 && year < 2200)
            return 40;
        else if (year >= 2200 && year < 2300)
            return 60;
    }

    getCenturyFromPeselMonth(month) {
        if (month >= 81 && month <= 92)
            return 19;
        else if (month >= 1 && month <= 12)
            return 20;
        else if (month >= 21 && month <= 32)
            return 21;
        else if (month >= 41 && month <= 52)
            return 22;
        else if (month >= 61 && month <= 72)
            return 23;
        else
            return -1;
    }

    getMonthFromPeselMonth(month) {
        if (month >= 81 && month <= 92)
            return month - 80;
        else if (month >= 1 && month <= 12)
            return month;
        else if (month >= 21 && month <= 32)
            return month - 20;
        else if (month >= 41 && month <= 52)
            return month - 40;
        else if (month >= 61 && month <= 52)
            return month - 60;
    }

    centuryToYear(century, years) {
        return (century - 1) * 100 + years;
    }

    getYearFromPesel(pesel) {
        if (pesel == null)
            return null;
        let yearRaw = parseInt(pesel.substr(0, 2));
        let monthRaw = parseInt(pesel.substr(2, 2));
        let century = this.getCenturyFromPeselMonth(monthRaw);

        return this.centuryToYear(century, yearRaw);
    }

    getMonthFromPesel(pesel) {
        if (pesel == null)
            return null;
        let monthRaw = parseInt(pesel.substr(2, 2));
        return this.getMonthFromPeselMonth(monthRaw);
    }

    getDayFromPesel(pesel) {
        if (pesel == null)
            return null;
        return parseInt(pesel.substr(4, 2));
    }

    getIsMaleFromPesel(pesel) {
        if (pesel == null)
            return null;
        return parseInt(pesel.charAt(9)) % 2 != 0;
    }

    dateToText(date) {
        let year = date.getFullYear().toString();
        let month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
        let day = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
        return year + "-" + month + "-" + day;
    }

    textToDate(text) {
        return new Date(text);
    }
}

export default FormView;