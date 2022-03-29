import { Dispatch, SetStateAction } from "react";
declare type Props = {
    value?: Date | undefined;
    month?: Date;
    onChange?: Dispatch<SetStateAction<Date | undefined>>;
    onMonthChange?: Dispatch<SetStateAction<Date>>;
};
export declare const Datepicker: (props: Props) => JSX.Element;
export {};
//# sourceMappingURL=Datepicker.d.ts.map