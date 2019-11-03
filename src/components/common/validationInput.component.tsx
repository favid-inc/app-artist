import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Input, InputProps } from '@kitten/ui';
import React from 'react';

interface ComponentProps extends InputProps {
  validator: (value: string) => boolean;
  formatter?: (value: string, stateValue: string) => string;
  /**
   * Will emit changes depending on validation:
   * Will be called with input value if it is valid, otherwise will be called with undefined
   */
  onChangeText?: (value: string | undefined) => void;
  onChangeValidation?: (isValid: boolean) => void;
}

interface State {
  value: string;
}

export type ValidationInputProps = ThemedComponentProps & ComponentProps;

/**
 * You probably don't need to pass `value` prop into this component
 */
class ValidationInputComponent extends React.Component<ValidationInputProps, State> {
  public state: State = {
    value: this.props.value,
  };

  public componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  public componentDidMount() {
    if (this.props.onChangeValidation) {
      this.props.onChangeValidation(this.isValid(this.props.value));
    }
  }

  public componentDidUpdate(prevProps: ValidationInputProps, prevState: State) {
    const { value: oldValue } = prevState;
    const { value: newValue } = this.state;

    const becomeValid: boolean = !this.isValid(oldValue) && this.isValid(newValue);
    const becomeInvalid: boolean = !this.isValid(newValue) && this.isValid(oldValue);

    if (oldValue !== newValue && this.props.onChangeValidation) {
      this.props.onChangeValidation(this.isValid(newValue));
    }
    if (becomeValid || becomeInvalid) {
      this.props.onChangeText(newValue);
    }
  }

  public render(): React.ReactNode {
    const { style, themedStyle, ...restProps } = this.props;

    return (
      <Input
        autoCapitalize='none'
        status={this.getStatus()}
        {...restProps}
        value={this.state.value}
        style={[themedStyle.container, style]}
        onChangeText={this.onChangeText}
      />
    );
  }

  private onChangeText = (text: string) => {
    const { formatter } = this.props;

    const value: string = formatter ? formatter(text, this.state.value) : text;

    this.setState({ value }, this.onValueChange);
  };

  private onValueChange = () => {
    const { value } = this.state;

    if (this.isValid(value) && this.props.onChangeText) {
      this.props.onChangeText(value);
    }
  };

  private isValid = (value: string): boolean => {
    const { validator } = this.props;
    const isValid = validator(value);
    return isValid;
  };

  private getStatus = (): string | undefined => {
    const { value } = this.state;

    if (value && value.length) {
      return this.isValid(value) ? 'success' : 'danger';
    }

    return undefined;
  };
}

export const ValidationInput = withStyles(ValidationInputComponent, (theme: ThemeType) => ({
  container: {},
}));
