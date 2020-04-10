import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Button } from 'react-native';

import Database from '../Database';
import Style from '../Style';

class ResultView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passportForm: this.props.route.params.passportForm,
            mode: this.props.route.params.mode
        };
    }

    render() {
        return (
            <View style={Style.container}>
                <ScrollView>
                    {this.state.mode !== 'show' && (<View style={Style.elementContainer}>
                        <Text style={Style.label}>Dziękujemy. Formularz został wysłany.</Text>
                    </View>)}
                    <View style={Style.elementContainer}>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Data: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.date.toString()}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Imię: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.name}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Nazwisko: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.surname}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>PESEL: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.pesel}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Płeć: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.sex}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Adres e-mail: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.email}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Numer telefonu: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.phone}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Dzień urodzin: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.birthDay}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Miesiąc urodzin: </Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.birthMonth}</Text>
                        </View>
                        <View style={Style.horizontalContainer}>
                            <Text style={Style.label}>Rok urodzin:</Text>
                            <Text style={Style.smallLabel}>{this.state.passportForm.birthYear}</Text>
                        </View>
                    </View>
                    <View style={Style.elementContainer}>
                        <View style={Style.verticalContainer}>
                            <Text style={Style.label}>Załącznik: </Text>
                            <Image style={{width: 300, height: 300, margin: 3}} resizeMode="contain" source={{uri: this.state.passportForm.file}} />
                        </View>
                    </View>
                </ScrollView>
                {this.state.mode !== 'show' && (
                    <Button title="Zapisz" onPress={() => this.onSavePressed(this)} />)
                }
            </View>
        )
    }

    onSavePressed(context) {
        let db = Database.getInstance();
        let passportForm = context.state.passportForm;
        if (context.state.mode === 'create') {
            db.insert(passportForm, (insertId) => {
                passportForm.id = insertId;
                context.props.navigation.navigate('Main');
            });
        } else if (context.state.mode === 'edit') {
            db.update(passportForm, () => {
                context.props.navigation.navigate('Main');
            });
        }
    }
}

export default ResultView;