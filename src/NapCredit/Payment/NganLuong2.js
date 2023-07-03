import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Loading from '../../Loading/index';
import "./_nganLuong.scss";

const methods = ["atm_online", "direct_transfer"];
const apiSubcription = `https://pg.monsters.vn/api/subscriptions`;
const headers = {
  "Content-type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
};
export default function NganLuong2({ userProfile, packageNum }) {
  const [pos, setPos] = useState(0); //vi tri chon kieu thanh toan
  const [isChecked, setIsChecked] = useState("");
  const [isValidate, setIsValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataNL, setDataNL] = useState({
    bank_code: "",
  });
  const onChangeDataNganLuong = (e) => {
    const { name, value } = e.target;
    setDataNL((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //clear data
  useEffect(() => {
    return () => {
      setPos(0);
      setIsChecked("");
      setIsValidate(false);
      setIsLoading(false);
      setDataNL({ bank_code: "" });
    };
  }, []);

  const onClickCheck = (e, index) => {
    setPos(index);
    setIsChecked(methods[index - 1]);
    onChangeDataNganLuong(e);
  };

  const setExpressCheckout = async (e) => {
    e.preventDefault();
    // const data = {
    //   paygate: 1, // 0 la paypal, 1 la Ngan luong
    //   bank_code: dataNL.bank_code,
    //   package: packageNum <= 4 ? 1 : 2, // 1 la vip, 2 la standard
    //   nmonth: dataPagekage[packageNum - 1].period,
    //   total: dataPagekage[packageNum - 1].price_sale,
    // };
    if (dataNL.bank_code === "") {
      setIsValidate(true);
      return;
    } else {
      setIsValidate(false);
      setIsLoading(true);
      // await axios
      //   .post(apiSubcription, data, { headers: headers })
      //   .then((res) => {
      //     //tra ve duong dan checkout sang ngan luong
      //     let data = res.data.data;
      //     setIsLoading(false);
      //     window.location.href = data.checkout_url;
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });
      setTimeout(()=>{setIsLoading(false)}, 2)
    }
  };

  const handleFocus = (event) => event.target.select();

  return (
    <div>
      {isLoading && <Loading />}
      <h4>Thanh toán online trực tiếp hoặc qua Ngân lượng</h4>
      <form name="NLpayBank">
        <ul className="list-content">
          <li className={pos === 1 ? "checkBoxs active" : "checkBoxs"}>
            <label>
              <input
                type="radio"
                defaultValue={"ATM_ONLINE"}
                name="payment_method_NL"
                checked={isChecked === "atm_online"}
                onClick={(e) => onClickCheck(e, 1)}
                className="radio-method"
              />
              <Typography display="inline">Thẻ ATM ngân hàng nội địa qua Ngân lượng</Typography>
              
            </label>
            <div className="boxContent">
              <p>
                <i>
                  <span
                    style={{
                      color: "#ff5a00",
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    Lưu ý
                  </span>
                  : Bạn cần đăng ký Internet-Banking hoặc dịch vụ thanh toán
                  trực tuyến tại ngân hàng trước khi thực hiện.
                </i>
              </p>
              <ul className="cardList clearfix">
                <li className="bank-online-methods ">
                  <label htmlFor="vcb_ck_on">
                    <i
                      className="BIDV"
                      title="Ngân hàng TMCP Đầu tư &amp; Phát triển Việt Nam"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"BIDV"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>
                <li className="bank-online-methods ">
                  <label htmlFor="vcb_ck_on">
                    <i
                      className="VCB"
                      title="Ngân hàng TMCP Ngoại Thương Việt Nam"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"VCB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="vnbc_ck_on">
                    <i className="DAB" title="Ngân hàng Đông Á"></i>
                    <input
                      type="radio"
                      defaultValue={"DAB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="tcb_ck_on">
                    <i className="TCB" title="Ngân hàng Kỹ Thương"></i>
                    <input
                      type="radio"
                      defaultValue={"TCB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_mb_ck_on">
                    <i className="MB" title="Ngân hàng Quân Đội"></i>
                    <input
                      type="radio"
                      defaultValue={"MB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_vib_ck_on">
                    <i className="VIB" title="Ngân hàng Quốc tế"></i>
                    <input
                      type="radio"
                      defaultValue={"VIB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_vtb_ck_on">
                    <i
                      className="ICB"
                      title="Ngân hàng Công Thương Việt Nam"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"ICB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_exb_ck_on">
                    <i className="EXB" title="Ngân hàng Xuất Nhập Khẩu"></i>
                    <input
                      type="radio"
                      defaultValue={"EXB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_acb_ck_on">
                    <i className="ACB" title="Ngân hàng Á Châu"></i>
                    <input
                      type="radio"
                      defaultValue={"ACB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_hdb_ck_on">
                    <i
                      className="HDB"
                      title="Ngân hàng Phát triển Nhà TPHCM"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"HDB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_msb_ck_on">
                    <i className="MSB" title="Ngân hàng Hàng Hải"></i>
                    <input
                      type="radio"
                      defaultValue={"MSB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_nvb_ck_on">
                    <i className="NVB" title="Ngân hàng Nam Việt"></i>
                    <input
                      type="radio"
                      defaultValue={"NVB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_vab_ck_on">
                    <i className="VAB" title="Ngân hàng Việt Á"></i>
                    <input
                      type="radio"
                      defaultValue={"VAB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_vpb_ck_on">
                    <i
                      className="VPB"
                      title="Ngân Hàng Việt Nam Thịnh Vượng"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"VPB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_scb_ck_on">
                    <i className="SCB" title="Ngân hàng Sài Gòn Thương tín"></i>
                    <input
                      type="radio"
                      defaultValue={"SCB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="bnt_atm_pgb_ck_on">
                    <i
                      className="PGB"
                      title="Ngân hàng Xăng dầu Petrolimex"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"PGB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="bnt_atm_gpb_ck_on">
                    <i
                      className="GPB"
                      title="Ngân hàng TMCP Dầu khí Toàn Cầu"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"GPB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="bnt_atm_agb_ck_on">
                    <i
                      className="AGB"
                      title="Ngân hàng Nông nghiệp &amp; Phát triển nông thôn"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"AGB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>

                <li className="bank-online-methods ">
                  <label htmlFor="bnt_atm_sgb_ck_on">
                    <i
                      className="SGB"
                      title="Ngân hàng Sài Gòn Công Thương"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"SGB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>
                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_bab_ck_on">
                    <i className="BAB" title="Ngân hàng Bắc Á"></i>
                    <input
                      type="radio"
                      defaultValue={"BAB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>
                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_bab_ck_on">
                    <i className="TPB" title="Tền phong bank"></i>
                    <input
                      type="radio"
                      defaultValue={"TPB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>
                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_bab_ck_on">
                    <i className="NAB" title="Ngân hàng Nam Á"></i>
                    <input
                      type="radio"
                      defaultValue={"NAB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>
                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_bab_ck_on">
                    <i
                      className="SHB"
                      title="Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"SHB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>
                <li className="bank-online-methods ">
                  <label htmlFor="sml_atm_bab_ck_on">
                    <i
                      className="OJB"
                      title="Ngân hàng TMCP Đại Dương (OceanBank)"
                    ></i>
                    <input
                      type="radio"
                      defaultValue={"OJB"}
                      name="bank_code"
                      onClick={(e) => onChangeDataNganLuong(e)}
                    />
                  </label>
                </li>
              </ul>
              <table style={{ clear: "both", width: "100%", paddingLeft: 46 }}>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="submit"
                        name="nlpayment"
                        value={"Thanh toán"}
                        className="confirm-submit"
                        onClick={(e) => setExpressCheckout(e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {isValidate && <p className="require">Bạn chưa chọn ngân hàng</p>}
          </li>
          <li className={pos === 2 ? "checkBoxs active" : "checkBoxs"}>
            <label>
              <input
                type="radio"
                defaultValue={"DIRECT_TRANSFER"}
                name="payment_method_TRANSFER"
                checked={isChecked === "direct_transfer"}
                onClick={(e) => onClickCheck(e, 2)}
                className="radio-method"
              />
              <Typography display="inline">Chuyển khoản trực tiếp (Cần 30 phút để cập nhật)</Typography>
              
            </label>
            <div className="boxContent">
              <p>
                <i>
                  <span
                    style={{
                      color: "#ff5a00",
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    Lưu ý
                  </span>
                  : Sẽ mất khoảng 30 phút để cập nhật thông tin thanh toán sau
                  khi người dùng thanh toán thành công.
                </i>
              </p>
              <div className="direct-transfer-infor">
                <h6>Thông tin chủ tài khoản</h6>
                <ul>
                  <li className="row">
                    <div className="col-3 justify-content-left align-items-center d-flex">
                      <label>Họ và Tên</label>
                    </div>
                    <div className="col-9">
                      <input
                        type="text"
                        id="form6Example3"
                        className="form-control"
                        placeholder="Họ và Tên"
                        defaultValue={"Trương Văn Hùng"}
                        name="name"
                        onFocus={(e) => handleFocus(e)}
                        readOnly
                      />
                    </div>
                  </li>
                  <li className="row">
                    <div className="col-3 justify-content-left align-items-center d-flex">
                      <label>Số tài khoản</label>
                    </div>
                    <div className="col-9">
                      <input
                        type="text"
                        id="form6Example3"
                        className="form-control"
                        placeholder="Số tài khoản"
                        defaultValue={"9383621309"}
                        name="class"
                        onFocus={(e) => handleFocus(e)}
                        readOnly
                      />
                    </div>
                  </li>
                  <li className="row">
                    <div className="col-3 justify-content-left align-items-center d-flex">
                      <label>Ngân hàng</label>
                    </div>
                    <div className="col-9">
                      <input
                        type="text"
                        id="form6Example3"
                        className="form-control"
                        placeholder="Ngân hàng"
                        defaultValue={"Ngân hàng Vietcombank"}
                        name="bank"
                        onFocus={(e) => handleFocus(e)}
                        readOnly
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
