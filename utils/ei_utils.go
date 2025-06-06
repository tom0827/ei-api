package utils

import (
	"encoding/base64"
	"errors"
	"io"
	"net/http"

	ei_proto "ei-api/proto"

	"google.golang.org/protobuf/proto"
)

const ENDPOINT = "https://ctx-dot-auxbrainhome.appspot.com"

func GetClientVersionPayload(eid string) *ei_proto.EggIncFirstContactRequest {
	return &ei_proto.EggIncFirstContactRequest{
		Rinfo: &ei_proto.BasicRequestInfo{
			EiUserId:      &eid,
			ClientVersion: proto.Uint32(69),
			Version:       proto.String("1.34"),
			Build:         proto.String("111299"),
		},
		EiUserId:      &eid,
		ClientVersion: proto.Uint32(69),
	}
}

func EncodePayloadToBase64(payload proto.Message) (string, error) {
	data, err := proto.Marshal(payload)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(data), nil
}

func FetchData(base64Data string) (string, error) {
	resp, err := http.PostForm(ENDPOINT+"/ei/bot_first_contact", map[string][]string{
		"data": {base64Data},
	})
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", errors.New("non-200 response: " + resp.Status)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	return string(bodyBytes), err
}

func DecodeResponse(encoded string, out proto.Message) error {
	data, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return err
	}
	return proto.Unmarshal(data, out)
}
