import { RequestWithdraw } from '@favid-inc/api/lib/app-artist';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import React from 'react';
import { Alert, Platform, View, ViewProps } from 'react-native';
import validate from 'validate.js';

import { ScrollableAvoidKeyboard, textStyle, ValidationInput } from '@src/components/common';
import { VALUE_REGEX } from '@src/core/formatters';
import { apiClient } from '@src/core/utils/apiClient';
import { SettingsContext } from '../context';

interface ComponentProps {
  onDone: () => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;

interface State {
  model: {
    amount: string;
  };
  sending: boolean;
  validation: {
    value: string[];
  };
}

const valueValidator = (amountStr: string) => {
  return (requiredStr: string) => {
    const request = Number(requiredStr);
    const amount = Number(amountStr);
    if (request > amount) {
      return false;
    }
    return VALUE_REGEX.test(requiredStr);
  };
};

class WithdrawFormComponent extends React.Component<Props, State> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;

  public state: State = {
    model: {
      amount: '',
    },
    sending: false,
    validation: {
      value: [],
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

  public onSend = async () => {
    if (this.isInValid()) {
      return;
    }

    this.setState({ sending: true });

    try {
      const request: RequestWithdraw['Request'] = {
        url: '/RequestWithdraw',
        method: 'POST',
        data: {
          amount: parseFloat(this.state.model.amount),
        },
      };

      const response = await apiClient.request<RequestWithdraw['Response']>(request);

      this.context.setWalletInfo({ ...this.context.walletInfo, balance: response.data });

      Alert.alert('Solicitação enviada com sucesso');

      this.props.onDone();
    } catch {
      Alert.alert('Erro ao enviar solicitação');
    } finally {
      this.setState({ sending: false });
    }
  };

  public render() {
    const { style, themedStyle } = this.props;

    const { walletInfo } = this.context;

    const { balance } = walletInfo;

    const currentBalance = parseInt(String(balance.available || '').replace(/\D/g, ''), 10) || 0 / 10;

    return (
      <ScrollableAvoidKeyboard style={[themedStyle.container, style]} extraScrollHeight={this.keyboardOffset}>
        <View style={[themedStyle.container, style]}>
          <Text style={themedStyle.title} appearance='hint' category='h6'>
            Quanto você quer sacar?
          </Text>
          <ValidationInput
            keyboardType='numeric'
            labelStyle={textStyle.label}
            onChangeText={this.valueChangeHandler}
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            validator={valueValidator(currentBalance.toString())}
            value={this.state.model.amount}
          />
          <ErrorMessages errors={this.state.validation.value} />
          <Text appearance='hint' style={themedStyle.title}>
            {`Seu saldo atual é de R$ ${currentBalance.toString().replace('.', ',')}`}
          </Text>

          <Button
            disabled={this.state.sending || currentBalance <= 0}
            onPress={this.onSend}
            size='giant'
            status='success'
            style={themedStyle.saveButton}
            textStyle={textStyle.button}
          >
            {this.state.sending ? 'Processando...' : 'Solicitar Saque'}
          </Button>
        </View>
      </ScrollableAvoidKeyboard>
    );
  }

  private valueChangeHandler = (value) => {
    return this.onChange({ value });
  };

  private isInValid = () => {
    const { model } = this.state;
    // console.log('isInvalid', model);
    const m = {
      ...model,
    };

    const errors = validate(m, {
      value: {
        presence: true,
        format: {
          pattern: VALUE_REGEX,
          message: '^Valor inválido.',
        },
      },
    });
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
export const WithdrawForm = withStyles<ComponentProps>(WithdrawFormComponent, (theme: ThemeType) => ({
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
