import { Box, Button, Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
  addMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type StateContext = { date: Date | undefined; month: Date };
type DispatchContext = (date: Date | undefined) => void;

const DatepickerStateContext = createContext<StateContext | undefined>(
  undefined
);
const DatepickerDispatchContext = createContext<DispatchContext | undefined>(
  undefined
);

const useDatepickerDispatch = () => {
  const ctx = useContext(DatepickerDispatchContext);

  if (!ctx) {
    throw new Error("DatepickerContext is not defined");
  }

  return ctx;
};

const useDatepickerState = () => {
  const ctx = useContext(DatepickerStateContext);

  if (!ctx) {
    throw new Error("DatepickerContext is not defined");
  }

  return ctx;
};

type Props = {
  value?: Date | undefined;
  month?: Date;
  onChange?: Dispatch<SetStateAction<Date | undefined>>;
  onMonthChange?: Dispatch<SetStateAction<Date>>;
};

export const Datepicker = (props: Props) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [localMonth, setMonth] = useState(() => new Date());

  const value = props.value ?? date;
  const onChange = props.onChange ?? setDate;
  const onMonthChange = props.onMonthChange ?? setMonth;
  const month = props.month ?? localMonth;

  const monthStart = useMemo(() => startOfMonth(month), [month]);
  const monthEnd = useMemo(() => endOfMonth(month), [month]);
  const weeks = useMemo(
    () =>
      eachWeekOfInterval(
        { start: monthStart, end: monthEnd },
        { weekStartsOn: 1 }
      ),
    [monthStart, monthEnd]
  );

  const state = useMemo(() => ({ date: value, month }), [value, month]);

  return (
    <DatepickerDispatchContext.Provider value={onChange}>
      <DatepickerStateContext.Provider value={state}>
        <Container>
          <Flex mx="auto" gap={3}>
            <Button
              onClick={() => onMonthChange((current) => subMonths(current, 1))}
            >
              Prev
            </Button>
            <Button
              onClick={() => onMonthChange((current) => addMonths(current, 1))}
            >
              Next
            </Button>
          </Flex>
          <Box textAlign="center">{format(month, "LLLL")}</Box>
          <Weekdays />
          {weeks.map((week) => (
            <Week key={+week} date={week} month={month} />
          ))}
        </Container>
      </DatepickerStateContext.Provider>
    </DatepickerDispatchContext.Provider>
  );
};

const Weekdays = () => {
  const weekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    []
  );
  const weekEnd = useMemo(() => endOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const days = useMemo(
    () => eachDayOfInterval({ start: weekStart, end: weekEnd }),
    [weekStart, weekEnd]
  );
  return (
    <WeekContainer>
      {days.map((day) => (
        <Weekday key={+day}>{format(day, "eee")}</Weekday>
      ))}
    </WeekContainer>
  );
};

const Week = ({ date, month }: { date: Date; month: Date }) => {
  const weekStart = useMemo(
    () => startOfWeek(date, { weekStartsOn: 1 }),
    [date]
  );
  const weekEnd = useMemo(() => endOfWeek(date, { weekStartsOn: 1 }), [date]);
  const days = useMemo(
    () => eachDayOfInterval({ start: weekStart, end: weekEnd }),
    [weekStart, weekEnd]
  );

  return (
    <WeekContainer>
      {days.map((day) => (
        <Day date={day} month={month} />
      ))}
    </WeekContainer>
  );
};

const Day = ({ date, month }: { date: Date; month: Date }) => {
  const isOutsideMonth = useMemo(
    () => !isSameMonth(date, month),
    [date, month]
  );

  const dispatch = useDatepickerDispatch();
  const { date: selectedDate } = useDatepickerState();

  const isSelected = useMemo(
    () => selectedDate && isSameDay(selectedDate, date),
    [selectedDate, date]
  );

  const onClick = useCallback(() => {
    if (!isSelected) {
      dispatch(date);
      return;
    }
    dispatch(undefined);
  }, [date, dispatch, isSelected]);

  if (isOutsideMonth) {
    return (
      <StyledDay>
        <div>{date.getDate()}</div>
      </StyledDay>
    );
  }
  return (
    <StyledDay>
      <Button
        bg={isSelected ? "orange.300" : undefined}
        _hover={{ bg: isSelected ? "orange.400" : "gray.300" }}
        _focus={{ boxShadow: "outline", zIndex: 1 }}
        onClick={onClick}
      >
        {date.getDate()}
      </Button>
    </StyledDay>
  );
};

const Container = styled.div`
  max-width: 500px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

const WeekContainer = styled.div`
  display: flex;
  column-gap: 12px;
`;

const StyledDay = styled.div`
  aspect-ratio: 1;
  flex: 1;

  > div,
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
`;

const Weekday = styled.div`
  flex: 1;
  text-align: center;
  font-weight: 600;
`;
