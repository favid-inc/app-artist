import { Text } from '@kitten/ui';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface ComponentProps {
  children: string[];
}

type Props = ViewProps & ComponentProps;

export function Markdown({ children, ...props }: Props) {
  const content = React.useMemo(
    () =>
      children.map((child, index) => (
        <Text key={index} category={category(child)} appearance='alternative'>
          {sanitize(child)}
        </Text>
      )),
    [children],
  );
  return <View {...props}>{content}</View>;
}

function category(content: string): string {
  if (/^[A-Z]+\./.test(content)) {
    return 's1';
  }

  const h = /^\#+/.exec(content);
  if (h) {
    return `h${h[0].length + 2}`;
  }

  return 'p1';
}

function sanitize(content: string): string {
  return content.replace(/^\#+/, '').trim();
}
