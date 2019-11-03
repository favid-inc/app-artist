import { ThemedComponentProps } from '@kitten/theme';
import { Input } from '@kitten/ui';
import React from 'react';
import { View } from 'react-native';

import { textStyle } from '@src/components/common';

import { RegisterInformation } from '../types';

interface ComponentProps {
  value: RegisterInformation;
  onChange: (val: RegisterInformation) => void;
}

export type Props = ThemedComponentProps & ComponentProps;

export class RegisterInformationForm extends React.Component<Props> {
  public render() {
    const { themedStyle } = this.props;

    const { value } = this.props;

    return (
      <>
        {value.type === 'individual' && (
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <Input
              autoCapitalize='words'
              autoCompleteType='name'
              keyboardType='default'
              label='Nome'
              labelStyle={textStyle.label}
              onChangeText={this.onNameChange}
              status={value.name ? 'success' : 'danger'}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              value={value.name}
            />
          </View>
        )}
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <Input
            keyboardType='numeric'
            label='CPF'
            labelStyle={textStyle.label}
            onChangeText={this.onDocumentNumberChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            status={value.document_number.length === '000.000.000-00'.length ? 'success' : 'danger'}
            value={value.document_number}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <Input
            autoCompleteType='tel'
            keyboardType='phone-pad'
            label='Celular'
            labelStyle={textStyle.label}
            onChangeText={this.onPhoneNumberChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            status={value.phone_numbers[0].number.length >= 10 ? 'success' : 'danger'}
            value={
              value.phone_numbers[0].number
                ? `(${value.phone_numbers[0].ddd}) ${value.phone_numbers[0].number}`
                : value.phone_numbers[0].ddd
            }
          />
        </View>
      </>
    );
  }

  private onDocumentNumberChange = (value = '') => {
    const [, g1, g2, g3, g4] = value
      .replace(/\D/g, '')
      .substr(0, 11)
      .match(/^(\d{1,3})?(\d{1,3})?(\d{1,3})?(\d{1,2})?/);

    const document = [g1, g2, g3].filter((v) => v).join('.');

    const dv = g4;

    this.props.onChange({ ...this.props.value, document_number: dv ? `${document}-${dv}` : document });
  };

  private onNameChange = (value = '') => {
    this.props.onChange({
      ...this.props.value,
      name: value,
      type: 'individual',
    });
  };

  private onPhoneNumberChange = (value = '') => {
    const val = value.replace(/\D/g, '').substr(0, 11);

    const [, g1, g2, g3] = val.match(
      val.length <= 10 ? /(\d{1,2})?(\d{1,4})?(\d{1,4})?/ : /(\d{1,2})?(\d{1,5})?(\d{1,4})?/,
    );

    this.props.onChange({
      ...this.props.value,
      phone_numbers: [
        {
          type: 'mobile',
          ddd: g1,
          number: [g2, g3].filter((v) => !isNaN(Number(v))).join('-'),
        },
      ],
    });
  };
}
