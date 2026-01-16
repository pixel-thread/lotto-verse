import React, { useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Button, Input, Separator, View, Paragraph } from 'tamagui';
import { RefreshControl } from 'react-native-gesture-handler';
import { EmptyCard } from '@/src/components/common/EmptyCard';
import { useMutation } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { LOG_ENDPOINTS } from '@/src/lib/endpoints/log';
import { toast } from 'sonner-native';

export type LogsT = {
  id: string;
  type: 'INFO' | 'ERROR' | 'WARNING' | 'DEBUG';
  timestamp: string;
  isBackend: boolean;
  message: string;
  content: Record<string, any>;
};

export const AdminLogScreen = () => {
  const [isBackend, setIsBackend] = useState<boolean>(false);
  const [level, setLevel] = useState<LogsT['type']>('INFO');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [startTime, setStartTime] = useState<string>(new Date().toISOString());
  const [endTime, setEndTime] = useState<string>(new Date().toISOString());
  const [logs, setLogs] = useState<LogsT[] | null>([]);
  // ✅ FIXED - proper URL encoding
  const params = new URLSearchParams({
    isBackend: isBackend.toString(),
    type: level,
    ...(query && { message: query }),
    startTime: new Date(startTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
  });

  const url = `${LOG_ENDPOINTS.GET_LOGS}?${params.toString()}`;

  const { isPending: isFetching, mutate } = useMutation({
    mutationKey: ['logs', isBackend, level, query],
    mutationFn: () => http.get<LogsT[]>(url),
    onSuccess: (data) => {
      if (data.success) {
        setLogs(data.data);
        toast.success(data.message, { position: 'top-center' });
        return data;
      }
      toast.error(data.message, { position: 'top-center' });
      setLogs([]);
    },
  });

  const onRefresh = useCallback(() => mutate(), []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}
        style={{ width: '100%' }}>
        <YStack paddingBlock="$4" paddingInline="$4" gap="$5">
          <Card padding="$5" rounded="$8" bordered>
            <YStack gap="$2" items="center">
              <Text fontSize="$8" fontWeight="900">
                System Logs
              </Text>
              <Text fontSize="$3" color="gray">
                Review recent app and backend events
              </Text>
            </YStack>
          </Card>

          <Card padding="$4" rounded="$6" bordered bg="$background">
            <YStack gap="$3">
              <YStack gap={'$2'}>
                <Text fontSize="$8" fontWeight="800">
                  Filters
                </Text>
              </YStack>

              <YStack gap={'$2'}>
                <Input placeholder="Search logs" value={query} onChangeText={setQuery} />
              </YStack>

              <Separator />
              {/* Date Pick*/}

              <XStack justify={'space-evenly'} gap={'$2'}>
                <YStack gap={'$2'} flex={1}>
                  <Text>Start Date</Text>
                  <Input placeholder="YYYY-MM-DD" value={startTime} onChangeText={setStartTime} />
                </YStack>
                <YStack gap={'$2'} flex={1}>
                  <Text>End Date</Text>
                  <Input placeholder="YYYY-MM-DD" value={endTime} onChangeText={setEndTime} />
                </YStack>
              </XStack>
              <Separator />
              <XStack gap="$2" items="center" justify="space-between">
                <XStack gap="$2" flexWrap="wrap">
                  <Button
                    size="$3"
                    themeInverse={isBackend}
                    variant={isBackend ? undefined : 'outlined'}
                    onPress={() => setIsBackend(true)}>
                    <Button.Text>Backend</Button.Text>
                  </Button>
                  <Button
                    size="$3"
                    themeInverse={!isBackend}
                    variant={!isBackend ? undefined : 'outlined'}
                    onPress={() => setIsBackend(false)}>
                    <Button.Text>Frontend</Button.Text>
                  </Button>
                </XStack>
              </XStack>

              <Separator />
              <XStack gap={'$2'}>
                {(['INFO', 'ERROR', 'WARNING', 'DEBUG'] as LogsT['type'][]).map((lv) => (
                  <Button
                    key={lv}
                    size="$3"
                    themeInverse={level === lv}
                    variant={level === lv ? undefined : 'outlined'}
                    onPress={() => setLevel(lv)}>
                    <Button.Text>{lv}</Button.Text>
                  </Button>
                ))}
              </XStack>
              <Separator />
              <YStack justify="space-between">
                <Button onPress={() => mutate()} themeInverse>
                  Query Logs
                </Button>
              </YStack>
              <Separator />
              <XStack justify="space-between">
                <Text color="gray">Total</Text>
                <Text>{logs?.length || 0}</Text>
              </XStack>
            </YStack>
          </Card>

          <Separator />

          {logs && logs.length === 0 ? (
            <Card bordered padded>
              <YStack>
                <Text fontSize="$3" text="center">
                  No logs found
                </Text>
              </YStack>
            </Card>
          ) : (
            <YStack gap="$4">
              {logs &&
                logs.map((log) => (
                  <Card
                    key={log.id}
                    padding="$4"
                    rounded="$6"
                    bordered
                    borderColor="$borderColor"
                    bg="$background">
                    <YStack gap="$3">
                      <YStack justify="space-between" items="flex-start" gap={'$2'}>
                        <Text fontWeight="800" fontSize={16}>
                          {log.message}
                        </Text>
                        <Text
                          fontSize={12}
                          fontWeight="700"
                          color={
                            log.type === 'ERROR'
                              ? '$red10'
                              : log.type === 'WARNING'
                                ? '$yellow10'
                                : log.isBackend
                                  ? '$blue10'
                                  : '$green10'
                          }
                          borderWidth={1}
                          borderColor={
                            log.type === 'ERROR'
                              ? '$red10'
                              : log.type === 'WARNING'
                                ? '$yellow10'
                                : log.isBackend
                                  ? '$blue10'
                                  : '$green10'
                          }
                          rounded="$4"
                          paddingInline="$2"
                          paddingBlock="$1">
                          {log.isBackend ? 'Backend' : 'Frontend'} • {log.type}
                        </Text>
                      </YStack>

                      <XStack justify="space-between" items="center">
                        <Text color="gray" fontSize={12}>
                          {new Date(log.timestamp).toLocaleString()}
                        </Text>
                        <Button size="$3" variant="outlined" onPress={() => toggleExpand(log.id)}>
                          <Button.Text>
                            {expanded[log.id] ? 'Hide Content' : 'View Content'}
                          </Button.Text>
                        </Button>
                      </XStack>

                      {expanded[log.id] && (
                        <View
                          bg="$background"
                          borderWidth={1}
                          borderColor="$borderColor"
                          rounded="$4"
                          p="$3">
                          <Paragraph size="$3">{JSON.stringify(log.content, null, 2)}</Paragraph>
                        </View>
                      )}
                    </YStack>
                  </Card>
                ))}
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </>
  );
};
