import React from 'react';
import { VALUE_REGEX } from '../../../core/formatters';
import validate from 'validate.js';
import { SettingsContext } from '../context';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text } from 'react-native-ui-kitten/ui';
import { View, ViewProps, Alert, Platform } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { textStyle, ValidationInput, ScrollableAvoidKeyboard } from '../../../components/common';

export type Props = ThemedComponentProps & ViewProps & NavigationScreenProps;

interface State {
  model: {
    value: string;
  };
  loading: boolean;
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

class TransferComponent extends React.Component<Props, State> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;

  public state: State = {
    model: {
      value: '',
    },
    loading: false,
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

  public onSend = () => {
    if (this.isInValid()) {
      return;
    }
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.context.setCash(this.state.model.value);
      Alert.alert('Transferência efetuada com sucesso');
      this.props.navigation.goBack(null);
    }, 5000);
  };

  public render() {
    const { style, themedStyle } = this.props;

    return (
      <ScrollableAvoidKeyboard style={[themedStyle.container, style]} extraScrollHeight={this.keyboardOffset}>
        <View style={[themedStyle.container, style]}>
          <Text style={themedStyle.title} appearance='hint' category='h6'>
            Quanto você quer transferir?
          </Text>
          <ValidationInput
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            labelStyle={textStyle.label}
            validator={valueValidator(this.context.payment.cash)}
            keyboardType='numeric'
            onChangeText={this.valueChangeHandler}
            value={this.state.model.value}
          />
          <ErrorMessages errors={this.state.validation.value} />
          <Text appearance='hint' style={themedStyle.title}>
            {`Seu saldo atual é de R$ ${this.context.payment.cash}`}
          </Text>

          <Button
            status='success'
            style={themedStyle.saveButton}
            textStyle={textStyle.button}
            size='giant'
            disabled={this.state.loading}
            onPress={this.onSend}
          >
            {this.state.loading ? 'Processando...' : 'Solicitar Transferência'}
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
export const Transfer = withStyles(TransferComponent, (theme: ThemeType) => ({
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
