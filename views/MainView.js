import React, { Component } from 'react';
import { View, Button, FlatList, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';

import PassportForm from '../PassportForm';
import Database from '../Database';
import Style from '../Style';

class MainView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedData: []
        }
    }

    render() {
        return (
            <View style={Style.container}>
                <Button style={Style.input} title="Usuń zaznaczone" disabled={this.state.selectedData.length == 0} onPress={() => this.onDeletePressed(this)} />
                <FlatList 
                    data={this.state.data} 
                    renderItem={({item}) => (<PassportFormItem passportForm={item} onSelected={(passportForm) => this.onPassportFormSelected(this, passportForm)} onShow={(passportForm) => this.onShowPressed(this, passportForm)} onEdit={(passportForm) => this.onEditPressed(this, passportForm)} />)} 
                    keyExtractor={item => this.state.data.indexOf(item).toString()} />
                <Button style={Style.input} title="Nowy wniosek" onPress={() => this.onNewFormPressed(this)} />
            </View>
        );
    }

    componentDidMount() {
        this.onResumeHandler = () => this.onResume(this);
        this.props.navigation.addListener('focus', this.onResumeHandler);
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.onResumeHandler);
    }

    onResume(context) {
        context.loadData();
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

    loadData() {
        let db = Database.getInstance();
        db.initialize(() =>
            db.loadData((dataArray) =>
                this.updateStateProperty('data', dataArray)));
    }

    onPassportFormSelected(context, passportForm) {
        let selectedData = context.state.selectedData;
        let index = selectedData.indexOf(passportForm);
        if (index == -1) {
            selectedData.push(passportForm)
            passportForm.isSelected = true;
        }
        else {
            selectedData.splice(index, 1);
            passportForm.isSelected = false;
        }
        context.updateStateProperty("selectedData", selectedData);
    }

    onShowPressed(context, passportForm) {
        context.props.navigation.navigate('Result', {
            passportForm: passportForm,
            mode: 'show'
        });
    }

    onEditPressed(context, passportForm) {
        context.props.navigation.navigate('Form', {
            passportForm: passportForm,
            mode: 'edit'
        });
    }

    onDeletePressed(context) {
        let db = Database.getInstance();
        let selectedData = context.state.selectedData;
        let data = context.state.data;
        db.deleteMany(selectedData, () => {
            for (let passportForm of selectedData) {
                let index = data.indexOf(passportForm);
                data.splice(index, 1);
            }
            selectedData.length = 0;
            context.updateStateProperties(
                {name: 'data', value: data},
                {name: 'selectedData', value: selectedData}
            ); 
            selectedData.length = 0;
        });
    }

    onNewFormPressed(context) {
        context.props.navigation.navigate('Form', {
            passportForm: new PassportForm(),
            mode: 'create'
        });
    }
}

function PassportFormItem({passportForm, onSelected, onShow, onEdit}) {
    return (
        <View style={Style.elementContainer}>
            <View style={Style.horizontalContainer}>    
                <Checkbox status={passportForm.isSelected ? 'checked' : 'unchecked'} style={Style.radioButton} onPress={() => onSelected(passportForm)} />
                <View style={Style.verticalContainer}>
                    <Text style={Style.label}>{passportForm.date}</Text>
                    <View style={Style.horizontalContainer}>
                        <Text style={Style.smallLabelAlign}>{passportForm.name}</Text>
                        <Text style={Style.smallLabelAlign}>{passportForm.surname}</Text>
                    </View>
                    <View style={Style.horizontalContainer}>
                        <Button style={Style.input} title="Pokaż" onPress={() => onShow(passportForm)} />
                        <Button style={Style.input} title="Edytuj" onPress={() => onEdit(passportForm)} />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default MainView;