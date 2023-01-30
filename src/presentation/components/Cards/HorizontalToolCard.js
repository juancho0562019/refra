import React from 'react';
import { View, Text, Image, Alert } from 'react-native';
import 'moment/locale/es';
import { SIZES, COLORS, FONTS, icons, images }  from '../../../application';
import {IconButton,LineDivider} from '../../components';
//import {deleteTools} from '../../../infrastructure/stores/Models';
import { useSelector, useDispatch } from "react-redux";
const HorizontalToolCard = ({ containerStyle, item, onPress }) => {
  const dispatch = useDispatch();
  const handleRemoveTools = (id)=>
  {
    Alert.alert(
      'Cuidado!!!',
      'Realmente deseas eliminar este registro?',
      [
        {
          text: 'Ok',
          onPress: () => dispatch(
            //deleteTools(id)
          ),
        },
        {
          text: 'Cancelar',
          onPress: () => null,
        },
      ],
      { cancelable: false }
    );
  
  }
  return (
    <View>
      {/* Details */}
      {item?.id?
      <View
      key={`Tools-${item?.id}`}
      style={{
        alignItems: "center",
        height: 90,
        backgroundColor:  COLORS.additionalColor11
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
          height: 90
        }}
      >
        {/* Icon */}
        <Image
          source={
            icons.tools
          }
          style={{ width: 40, height: 40 , borderRadius: 25}}
        />

        {/* Title & Duration */}
        <View style={{flex: 1, marginLeft: SIZES.radius}}>
          <Text style={{...FONTS.h3b}}>
            {item?.name}
          </Text>
          <Text style={{ color: COLORS.gray30, ...FONTS.body4 }}>
            {item?.fecha}
          </Text>
          <Text style={{ color: COLORS.gray30, ...FONTS.body5 }}>
            Origen {item?.workplaceStartName}
          </Text>
          <Text style={{ color: COLORS.gray30, ...FONTS.body5 }}>
            Estado {item?.condition}
          </Text>
        </View>
        <IconButton
              icon={icons.remove}
              iconStyle={{ width: 20, height: 20 }}
              containerStyle={{
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: COLORS.secondary,
                marginLeft: 5
              }}
              onPress={() => {
                handleRemoveTools(item?.id)
              }}
            />
      </View>
     
    </View>: null}
      
    </View>
  )
}

export default HorizontalToolCard;