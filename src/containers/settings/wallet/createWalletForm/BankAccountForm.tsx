import { ThemedComponentProps } from '@kitten/theme';
import { Input } from '@kitten/ui';
import React from 'react';
import { Picker, View } from 'react-native';

import { textStyle } from '@src/components/common';

import { BankAccountType, BankCode } from '../constants';
import { BankAccount } from '../types';

interface ComponentProps {
  value: BankAccount;
  onChange: (val: BankAccount) => void;
}

export type Props = ThemedComponentProps & ComponentProps;

export class BankAccountForm extends React.Component<Props> {
  public render() {
    const { themedStyle } = this.props;

    const { value } = this.props;

    return (
      <>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <Picker selectedValue={value.bank_code} style={themedStyle.input} onValueChange={this.onBankCodeChange}>
            {Object.keys(BankCode).map((key) => (
              <Picker.Item key={key} value={key.replace('_', '')} label={BankCode[key]} />
            ))}
          </Picker>
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <Input
            keyboardType='numeric'
            label='Agência'
            labelStyle={textStyle.label}
            onChangeText={this.onAgenciaChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            status={value.agencia.length === 3 && value.agencia_dv.length === 1 ? 'success' : 'danger'}
            value={value.agencia_dv ? `${value.agencia}-${value.agencia_dv}` : value.agencia}
          />
          <Input
            keyboardType='numeric'
            label='Conta'
            labelStyle={textStyle.label}
            onChangeText={this.onContaChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            status={value.conta && value.conta_dv.length === 1 ? 'success' : 'danger'}
            value={value.conta_dv ? `${value.conta}-${value.conta_dv}` : value.conta}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <Picker selectedValue={value.type} style={themedStyle.input} onValueChange={this.onTypeChange}>
            {Object.keys(BankAccountType).map((key) => (
              <Picker.Item key={key} value={key} label={BankAccountType[key]} />
            ))}
          </Picker>
        </View>
      </>
    );
  }

  private onBankCodeChange = (value = '') => {
    this.props.onChange({ ...this.props.value, bank_code: value });
  };

  private onAgenciaChange = (value = '') => {
    const [, agencia = '', dv = ''] = value.replace(/\D/g, '').match(/^(\d{1,})?(\d{1})/) || [];

    this.props.onChange({
      ...this.props.value,
      agencia: agencia || dv,
      agencia_dv: agencia && dv,
    });
  };

  private onContaChange = (value = '') => {
    const [, conta = '', dv = ''] = value.replace(/\D/g, '').match(/^(\d{1,})?(\d{1})/) || [];

    this.props.onChange({
      ...this.props.value,
      conta: conta || dv,
      conta_dv: conta && dv,
    });
  };

  private onTypeChange = (type) => this.props.onChange({ ...this.props.value, type });
}
