import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View, Picker } from 'react-native';

import { textStyle, ValidationInput } from '@src/components/common';
import { StringValidator } from '@src/core/validators';

import { BankAccount } from '../types';
import { BankAccountType, BankCode } from '../constants';

interface ComponentProps {
  bankAccount: BankAccount;
  onChange: (val: BankAccount) => void;
}

export type Props = ThemedComponentProps & ComponentProps;

class BankAccountFormComponent extends React.Component<Props> {
  public render() {
    const { themedStyle } = this.props;

    const { bankAccount } = this.props;

    return (
      <>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <ValidationInput
            keyboardType='default'
            label='Titular'
            labelStyle={textStyle.label}
            onChangeText={this.onLegalNameChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={StringValidator}
            value={bankAccount.legal_name}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <ValidationInput
            keyboardType='numeric'
            label='CPF'
            labelStyle={textStyle.label}
            onChangeText={this.onDocumentNumberChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={StringValidator}
            value={bankAccount.document_number}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <Picker selectedValue={bankAccount.bank_code} style={themedStyle.input} onValueChange={this.onBankCodeChange}>
            {Object.keys(BankCode).map((key) => (
              <Picker.Item key={key} value={key} label={BankCode[key]} />
            ))}
          </Picker>
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <ValidationInput
            keyboardType='numeric'
            label='Agência'
            labelStyle={textStyle.label}
            onChangeText={this.onAgenciaChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={StringValidator}
            value={bankAccount.agencia_dv ? `${bankAccount.agencia}-${bankAccount.agencia_dv}` : bankAccount.agencia}
          />
          <ValidationInput
            keyboardType='numeric'
            label='Conta'
            labelStyle={textStyle.label}
            onChangeText={this.onContaChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={StringValidator}
            value={bankAccount.conta_dv ? `${bankAccount.conta}-${bankAccount.conta_dv}` : bankAccount.conta}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <Picker selectedValue={bankAccount.type} style={themedStyle.input} onValueChange={this.onTypeChange}>
            {Object.keys(BankAccountType).map((key) => (
              <Picker.Item key={key} value={key} label={BankAccountType[key]} />
            ))}
          </Picker>
        </View>
      </>
    );
  }

  onLegalNameChange = (value = '') => {
    const val = value.trim();

    this.props.onChange({
      ...this.props.bankAccount,
      legal_name: val,
    });
  };

  onBankCodeChange = (value = '') => {
    const val = value.replace(/\D/g, '');

    this.props.onChange({ ...this.props.bankAccount, bank_code: val.replace(/\D/g, '') });
  };

  onAgenciaChange = (value = '') => {
    const val = value.replace(/\D/g, '');

    if (val.length > 1) {
      this.props.onChange({
        ...this.props.bankAccount,
        agencia: val.substr(0, val.length - 1),
        agencia_dv: val.substr(-1),
      });
    } else {
      this.props.onChange({
        ...this.props.bankAccount,
        agencia: val,
        agencia_dv: '',
      });
    }
  };

  onContaChange = (value = '') => {
    const val = value.replace(/\D/g, '');

    if (val.length > 1) {
      this.props.onChange({
        ...this.props.bankAccount,
        conta: val.substr(0, val.length - 1),
        conta_dv: val.substr(-1),
      });
    } else {
      this.props.onChange({
        ...this.props.bankAccount,
        conta: val,
        conta_dv: '',
      });
    }
  };

  onDocumentNumberChange = (value = '') => {
    const val = value
      .replace(/\D/g, '')
      .substring(0, 11)
      .replace(/^(\d{1,3})?(\d{1,3})?(\d{1,3})?(\d{1,2})?$/, (match, g1, g2, g3, g4) => {
        if (g4) {
          return `${g1}.${g2}.${g3}-${g4}`;
        }
        if (g3) {
          return `${g1}.${g2}.${g3}`;
        }
        if (g2) {
          return `${g1}.${g2}`;
        }
        if (g1) {
          return `${g1}`;
        }
        return '';
      });

    this.props.onChange({ ...this.props.bankAccount, document_number: val });
  };

  onTypeChange = (type) => this.props.onChange({ ...this.props.bankAccount, type });
}

export const BankAccountForm = withStyles<ComponentProps>(BankAccountFormComponent, (theme: ThemeType) => ({
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  inputText: {
    color: theme['text-alternative-color'],
  },
  input: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-alternative-color-1'],
    borderColor: theme['text-alternative-color'],
  },
}));
