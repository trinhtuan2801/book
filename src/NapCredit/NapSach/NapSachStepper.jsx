import { Step, StepLabel, Stepper } from "@material-ui/core"

const steps = ['Liệt kê hàng', 'Định giá hàng', 'Phê duyệt', 'Vận chuyển', 'Kết thúc']

const NapSachStepper = (props) => {
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

NapSachStepper.defaultProps = {
  step: 0
}

export default NapSachStepper