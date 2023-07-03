import { Step, StepLabel, Stepper } from "@material-ui/core"

const steps = ['Đăng nhập', 'Chọn địa chỉ', 'Thanh toán']

const ThanhToanStepper = (props) => {
  return (
    <Stepper alternativeLabel activeStep={props.step} style={{padding: '16px'}}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

ThanhToanStepper.defaultProps = {
  step: 0
}

export default ThanhToanStepper