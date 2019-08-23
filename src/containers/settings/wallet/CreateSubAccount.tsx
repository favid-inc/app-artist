import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { textStyle, ValidationInput } from '../../../components/common';
// import {Payer} from "../"

import axios from 'axios';
import {
  CepNumberFormatter,
  CpfNumberFormatter,
  PHONE_REGEX,
  PhoneNumberFormatter,
  StateFormatter,
} from '@src/core/formatters';
import {
  CepNumberValidator,
  CpfNumberValidator,
  EmailValidator,
  NameValidator,
  PhoneNumberValidator,
  StringValidator,
} from '../../../core/validators';

interface ComponentProps {
  onFormValueChange: (value: Payer | undefined) => void;
}

type Props = ComponentProps & ThemedComponentProps & ViewProps;

interface State {
  model: Payer;
  validation: {
    address: {
      street: boolean;
      number: boolean;
      district: boolean;
      city: boolean;
      state: boolean;
      zip_code: boolean;
      complement: boolean;
    };
    cpf_cnpj: boolean;
    email: boolean;
    name: boolean;
    phone: boolean;
    phone_prefix: boolean;
  };
}

type Context = typeof BuyingProcessContext;

class PayerForm extends React.Component<Props, State, Context> {
  static contextType = BuyingProcessContext;
  public context: React.ContextType<Context>;

  public state: State = {
    model: {
      address: {
        street: '',
        number: '',
        district: '',
        city: '',
        state: '',
        zip_code: '',
        complement: '',
      },
      cpf_cnpj: '',
      email: '',
      name: '',
      phone: '',
      phone_prefix: '',
    },
    validation: {
      address: {
        street: false,
        number: false,
        district: false,
        city: false,
        state: false,
        zip_code: false,
        complement: true,
      },
      cpf_cnpj: false,
      email: false,
      name: false,
      phone: false,
      phone_prefix: false,
    },
  };

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const oldFormValid: boolean = this.isValid(prevState);
    const newFormValid: boolean = this.isValid(this.state);
    // const becomeValid: boolean = !oldFormValid && newFormValid;
    // const becomeInvalid: boolean = oldFormValid && !newFormValid;
    // console.log('becomeValid', becomeValid);
    // console.log('becomeInvalid', becomeInvalid);
    if (oldFormValid !== newFormValid) {
      this.props.onFormValueChange(this.state.model);
    }
  }

  public componentDidMount() {
    // please remove this after testing
    this.onChange({
      cpf_cnpj: '080 779 539 99',
      email: 'gabriel.f.umbelino@gmail.com',
      name: 'Gabriel Umbelino',
      phone: '984452958',
      phone_prefix: '41',
      address: {
        headerstreet: 'Rua antonio jeronymo',
        number: '123',
        district: 'Cic',
        city: 'Curitiba',
        state: 'PR',
        zip_code: '81170 680',
        complement: '',
      },
    });

    this.onChangeValidation({
      cpf_cnpj: true,
      email: true,
      name: true,
      phone: true,
      phone_prefix: true,
      address: {
        street: true,
        number: true,
        district: true,
        city: true,
        state: true,
        zip_code: true,
        complement: true,
      },
    });
  }

  public onChange = (prop) => {
    const [propKey] = Object.keys(prop);
    if (prop[propKey]) {
      this.setState({ model: { ...this.state.model, ...prop } });
    }
  };

  public onChangeAddress = (prop) => {
    const [propKey] = Object.keys(prop);
    if (prop[propKey]) {
      this.onChange({ address: { ...this.state.model.address, ...prop } });
    }
  };

  public onChangeValidation = (prop) => {
    const [propKey] = Object.keys(prop);
    if (prop[propKey]) {
      this.setState({ validation: { ...this.state.validation, ...prop } });
    }
  };

  public onChangeAddressValidation = (prop) => {
    const [propKey] = Object.keys(prop);
    if (prop[propKey]) {
      this.onChangeValidation({ address: { ...this.state.validation.address, ...prop } });
    }
  };

  public onZipcodeChange = async (zip_code) => {
    if (!zip_code || zip_code === this.state.model.address.street) {
      return;
    }

    if (zip_code.length <= 8) {
      this.onChangeAddress({ zip_code });
      return false;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${zip_code.replace(/\D/g, '')}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;

      const address = {
        zip_code,
        street: logradouro,
        district: bairro,
        city: localidade,
        state: uf,
      };

      this.onChangeAddress(address);
      this.onChangeAddressValidation({
        zip_code: true,
        street: true,
        district: true,
        city: true,
        state: true,
      });
    } catch (error) {
      this.onChangeAddress({ zip_code });
      this.onChangeAddressValidation({
        zip_code: false,
        street: false,
        district: false,
        city: false,
        state: false,
      });
    }
  };

  public render() {
    const { style, themedStyle, ...restProps } = this.props;
    return (
      <View style={[themedStyle.container, style]} {...restProps}>
        <ValidationInput
          style={themedStyle.input}
          textStyle={textStyle.paragraph}
          labelStyle={textStyle.label}
          label='Nome'
          validator={NameValidator}
          onChangeText={(name) => this.onChange({ name })}
          onChangeValidation={(name) => this.onChangeValidation({ name })}
          value={this.state.model.name}
        />

        <ValidationInput
          style={themedStyle.input}
          textStyle={textStyle.paragraph}
          labelStyle={textStyle.label}
          label='CPF'
          validator={CpfNumberValidator}
          formatter={CpfNumberFormatter}
          maxLength={14}
          keyboardType='numeric'
          onChangeText={(cpf_cnpj) => this.onChange({ cpf_cnpj })}
          onChangeValidation={(cpf_cnpj) => this.onChangeValidation({ cpf_cnpj })}
          value={this.state.model.cpf_cnpj}
        />

        <ValidationInput
          style={themedStyle.input}
          textStyle={textStyle.paragraph}
          labelStyle={textStyle.label}
          label='Email'
          formatter={(email) => email.toLowerCase()}
          validator={EmailValidator}
          keyboardType='email-address'
          onChangeText={(email) => this.onChange({ email })}
          onChangeValidation={(email) => this.onChangeValidation({ email })}
          value={this.state.model.email}
        />

        <ValidationInput
          style={themedStyle.input}
          textStyle={textStyle.paragraph}
          labelStyle={textStyle.label}
          label='Telefone'
          validator={PhoneNumberValidator}
          formatter={PhoneNumberFormatter}
          maxLength={15}
          keyboardType='numeric'
          onChangeText={this.updatePhone}
          value={`${this.state.model.phone_prefix}${this.state.model.phone}`}
        />

        <ValidationInput
          style={[themedStyle.input, themedStyle.longInput]}
          textStyle={textStyle.paragraph}
          labelStyle={textStyle.label}
          label='CEP'
          validator={CepNumberValidator}
          formatter={CepNumberFormatter}
          maxLength={9}
          onChangeText={this.onZipcodeChange}
          onChangeValidation={(zip_code) => this.onChangeAddressValidation({ zip_code })}
          value={this.state.model.address.zip_code}
        />

        <View style={themedStyle.middleContainer}>
          <ValidationInput
            style={[themedStyle.input, themedStyle.shortInput]}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            label='Estado'
            formatter={StateFormatter}
            validator={StringValidator}
            maxLength={2}
            onChangeText={(state) => this.onChangeAddress({ state })}
            onChangeValidation={(state) => this.onChangeAddressValidation({ state })}
            value={this.state.model.address.state}
          />

          <ValidationInput
            style={[themedStyle.input, themedStyle.longInput]}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            label='Cidade'
            validator={StringValidator}
            onChangeText={(city) => this.onChangeAddress({ city })}
            onChangeValidation={(city) => this.onChangeAddressValidation({ city })}
            value={this.state.model.address.city}
          />
        </View>

        <ValidationInput
          style={themedStyle.input}
          textStyle={textStyle.paragraph}
          labelStyle={textStyle.label}
          label='Rua'
          validator={StringValidator}
          onChangeText={(street) => this.onChangeAddress({ street })}
          onChangeValidation={(street) => this.onChangeAddressValidation({ street })}
          value={this.state.model.address.street}
        />

        <View style={themedStyle.middleContainer}>
          <ValidationInput
            style={[themedStyle.input, themedStyle.shortInput]}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            label='Número'
            validator={StringValidator}
            maxLength={6}
            onChangeText={(number) => this.onChangeAddress({ number })}
            onChangeValidation={(number) => this.onChangeAddressValidation({ number })}
            value={this.state.model.address.number}
          />

          <ValidationInput
            style={[themedStyle.input, themedStyle.longInput]}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            label='Bairro'
            validator={StringValidator}
            onChangeText={(district) => this.onChangeAddress({ district })}
            onChangeValidation={(district) => this.onChangeAddressValidation({ district })}
            value={this.state.model.address.district}
          />
        </View>

        <ValidationInput
          style={themedStyle.input}
          textStyle={textStyle.paragraph}
          labelStyle={textStyle.label}
          label='Complemento'
          validator={StringValidator}
          onChangeText={(complement) => this.onChangeAddress({ complement })}
          onChangeValidation={(complement) => this.onChangeAddressValidation({ complement })}
          value={this.state.model.address.complement}
        />
        <ValidationErrors
          showErrors={false}
          validation={{ ...this.state.validation, ...this.state.validation.address }}
        />
      </View>
    );
  }

  private isValid = (state: State): boolean => {
    const validation = { ...state.validation, ...state.validation.address };
    const errors = Object.keys(validation)
      .filter((f) => typeof validation[f] === 'boolean')
      .filter((f) => {
        return !validation[f];
      });
    return Boolean(errors.length);
  };

  private updatePhone = (phone) => {
    const [prefix, firstNumbers, lastNumbers] = phone
      .replace(/\D/g, '')
      .match(PHONE_REGEX)
      .filter((v, i) => i && v);
    this.onChange({
      phone_prefix: `(${prefix}) `,
      phone: [firstNumbers, lastNumbers].join(' '),
    });
    this.onChangeValidation({ phone_prefix: `(${prefix}) `, phone: [firstNumbers, lastNumbers].join(' ') });
  };
}

const ValidationErrors = (props) => {
  if (!props.showErrors) {
    return <View />;
  }
  const errors = Object.keys(props.validation)
    .filter((f) => typeof props.validation[f] === 'boolean')
    .filter((f) => !props.validation[f]);
  return (
    <View>
      {errors.map((e) => (
        <Text key={e}>Campo obrigatório: {e}</Text>
      ))}
    </View>
  );
};

export const OrderInfoForm = withStyles(PayerForm, (theme: ThemeType) => ({
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: theme['background-basic-color-1'],
  },
  longInput: {
    width: 160,
    marginRight: 20,
  },
  shortInput: {
    width: 80,
    marginRight: 20,
  },
}));
