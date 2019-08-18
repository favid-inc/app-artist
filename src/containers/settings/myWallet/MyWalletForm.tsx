import React from 'react';
import axios from 'axios';
import {
  CPF_REGEX,
  CpfNumberFormatter,
  CepNumberFormatter,
  STRING_REGEX,
  TEXT_REGEX,
  CEP_REGEX,
  STATE_REGEX,
  PHONE_REGEX,
  PhoneNumberFormatter,
  NUMBER_REGEX,
} from '../../../core/formatters';
import validate from 'validate.js';
import { RadioGroup } from './RadioGroup';
import { constraints } from './constraints';
import { SettingsContext } from '../context';
import { validation } from '../../../core/validators';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text } from 'react-native-ui-kitten/ui';
import { View, ViewProps, Alert, Platform } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { textStyle, ValidationInput, ScrollableAvoidKeyboard } from '../../../components/common';

const banks = [
  'BRB',
  'Banco do Brasil',
  'Banrisul',
  'Bradesco',
  'Caixa Econômica',
  'Inter',
  'Itaú',
  'Santander',
  'Sicoob',
  'Sicredi',
];
const accountTypes = ['Corrente', 'Poupança'];
export type Props = ThemedComponentProps & ViewProps & NavigationScreenProps;

interface State {
  model: {
    cpf: string;
    name: string;
    cep: string;
    address: string;
    city: string;
    state: string;
    telephone: string;
    bank: string;
    bank_ag: string;
    bank_cc: string;
    account_type: string;
  };
  loading: boolean;
  validation: {
    cpf: string[];
    name: string[];
    cep: string[];
    address: string[];
    city: string[];
    state: string[];
    telephone: string[];
    bank: string[];
    bank_ag: string[];
    bank_cc: string[];
    account_type: string[];
  };
}

const nameValidator = (value) => TEXT_REGEX.test(value);
const cpfValidator = validation(CPF_REGEX);
const phoneValidator = validation(PHONE_REGEX);
const cepValidator = validation(CEP_REGEX);
const addressValidator = (value) => STRING_REGEX.test(value);
const stateValidator = (value) => STATE_REGEX.test(value);
const cityValidator = (value) => STRING_REGEX.test(value);
const agencyValidator = (value) => NUMBER_REGEX.test(value);
const accountValidator = (value) => NUMBER_REGEX.test(value);
class MyWalletFormComponent extends React.Component<Props, State> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;

  public state: State = {
    model: {
      cpf: '',
      name: '',
      cep: '',
      address: '',
      city: '',
      state: '',
      telephone: '',
      bank: '',
      bank_ag: '',
      bank_cc: '',
      account_type: '',
    },
    loading: false,
    validation: {
      cpf: [],
      name: [],
      cep: [],
      address: [],
      city: [],
      state: [],
      telephone: [],
      bank: [],
      bank_ag: [],
      bank_cc: [],
      account_type: [],
    },
  };

  private keyboardOffset: number = Platform.select({
    ios: 20,
    android: 228,
  });

  public onChange = (prop) => {
    if (!prop) {
      return;
    }

    const keys: string[] = Object.keys(prop);
    const validations = { ...this.state.validation };
    if (keys.length) {
      if (keys.length === 1) {
        const [key] = keys;
        if (prop[prop] === this.state.model[key]) {
          return false;
        }
      }
      keys.forEach((key) => {
        validations[key] = [];
      });
      this.setState({
        ...this.state,
        validation: { ...this.state.validation, ...validations },
        model: { ...this.state.model, ...prop },
      });
    }
  };

  public onCepChange = async (cep) => {
    if (!cep && cep === this.state.model.cep) {
      return;
    }

    if (cep.length <= 8) {
      this.onChange({ cep });
      return false;
    }
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
      const { logradouro, localidade, uf } = response.data;

      this.onChange({ cep, address: logradouro, city: localidade, state: uf });
    } catch (error) {
      this.onChange({ cep });
      console.error(error);
    }
  };

  public onSend = () => {
    if (this.isInValid()) {
      return;
    }
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.context.setPayment(this.state.model);
      Alert.alert('Dados bancários enviados com sucesso', 'Aguarde aprovação.');
      this.props.navigation.goBack(null);
    }, 5000);
  };

  public componentDidMount() {
    this.onChange({ ...this.context.payment });
  }

  public render() {
    const { style, themedStyle } = this.props;
    return (
      <ScrollableAvoidKeyboard style={[themedStyle.container, style]} extraScrollHeight={this.keyboardOffset}>
        <View style={[themedStyle.container, style]}>
          <Text style={themedStyle.title} appearance='hint' category='h6'>
            Dados Pessoais
          </Text>
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            validator={nameValidator}
            label='Nome'
            onChangeText={this.nameChangeHandler}
            value={this.state.model.name}
          />
          <ErrorMessages errors={this.state.validation.name} />
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            formatter={CpfNumberFormatter}
            validator={cpfValidator}
            label='CPF'
            maxLength={14}
            keyboardType='numeric'
            onChangeText={this.cpfChangeHandler}
            value={this.state.model.cpf}
          />
          <ErrorMessages errors={this.state.validation.cpf} />
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            formatter={PhoneNumberFormatter}
            validator={phoneValidator}
            label='Celular'
            maxLength={15}
            keyboardType='numeric'
            onChangeText={this.telephoneChangeHandler}
            value={this.state.model.telephone}
          />
          <ErrorMessages errors={this.state.validation.telephone} />
          <Text style={themedStyle.title} appearance='hint' category='h6'>
            Endereço
          </Text>
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            formatter={CepNumberFormatter}
            validator={cepValidator}
            label='CEP'
            maxLength={9}
            keyboardType='numeric'
            onChangeText={this.onCepChange}
            value={this.state.model.cep}
          />
          <ErrorMessages errors={this.state.validation.address} />
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            validator={addressValidator}
            label='Endereço'
            onChangeText={this.addressChangeHandler}
            value={this.state.model.address}
          />
          <ErrorMessages errors={this.state.validation.address} />
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            validator={stateValidator}
            label='Estado'
            maxLength={2}
            onChangeText={this.stateChangeHandler}
            value={this.state.model.state}
          />
          <ErrorMessages errors={this.state.validation.state} />
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            validator={cityValidator}
            label='Cidade'
            onChangeText={this.cityChangeHandler}
            value={this.state.model.city}
          />
          <ErrorMessages errors={this.state.validation.city} />
          <Text style={themedStyle.title} appearance='hint' category='h6'>
            Dados Bancários
          </Text>
          <RadioGroup label='Banco' value={this.state.model.bank} onSelect={this.bankChangeHandler} items={banks} />
          <ErrorMessages errors={this.state.validation.bank} />
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            validator={agencyValidator}
            label='Agência'
            maxLength={10}
            keyboardType='numeric'
            onChangeText={this.bank_agChangeHandler}
            value={this.state.model.bank_ag}
          />
          <ErrorMessages errors={this.state.validation.bank_ag} />
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            validator={accountValidator}
            label='Conta'
            maxLength={10}
            keyboardType='numeric'
            onChangeText={this.bank_ccChangeHandler}
            value={this.state.model.bank_cc}
          />
          <ErrorMessages errors={this.state.validation.bank_cc} />
          <RadioGroup
            label='Tipo de Conta'
            value={this.state.model.account_type}
            onSelect={this.account_typeChangeHandler}
            items={accountTypes}
          />
          <ErrorMessages errors={this.state.validation.account_type} />
          <Button
            status='success'
            style={themedStyle.saveButton}
            textStyle={textStyle.button}
            size='giant'
            disabled={this.state.loading}
            onPress={this.onSend}
          >
            {this.state.loading ? 'Processando...' : 'Enviar'}
          </Button>
        </View>
      </ScrollableAvoidKeyboard>
    );
  }

  private cpfChangeHandler = (cpf) => {
    return this.onChange({ cpf });
  };
  private nameChangeHandler = (name) => {
    return this.onChange({ name });
  };
  private addressChangeHandler = (address) => {
    return this.onChange({ address });
  };
  private cityChangeHandler = (city) => {
    return this.onChange({ city });
  };
  private stateChangeHandler = (state) => {
    return this.onChange({ state });
  };
  private telephoneChangeHandler = (telephone) => {
    return this.onChange({ telephone });
  };
  private bankChangeHandler = (bank) => {
    return this.onChange({ bank });
  };
  private bank_agChangeHandler = (bank_ag) => {
    return this.onChange({ bank_ag });
  };
  private bank_ccChangeHandler = (bank_cc) => {
    return this.onChange({ bank_cc });
  };
  private account_typeChangeHandler = (account_type) => {
    return this.onChange({ account_type });
  };

  private isInValid = () => {
    const { model } = this.state;
    // console.log('isInvalid', model);
    const m = {
      ...model,
      cpf: model.cpf.replace(/\D/g, ''),
      telephone: model.telephone.replace(/\D/g, ''),
      cep: model.cep.replace(/\D/g, ''),
    };
    const errors = validate(m, constraints);
    // console.log('errprs', errors);
    this.setState({ validation: { ...errors } });
    return Boolean(errors);
  };
}

const ErrorMessages = (props) => {
  if (!props.errors) {
    return null;
  }

  return (
    <View>
      {props.errors.map((e) => (
        <Text status='danger'>{e}</Text>
      ))}
    </View>
  );
};
export const MyWalletForm = withStyles(MyWalletFormComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: theme['background-basic-color-2'],
  },
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    padding: 10,
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
  saveButton: {
    marginVertical: 10,
  },
}));
