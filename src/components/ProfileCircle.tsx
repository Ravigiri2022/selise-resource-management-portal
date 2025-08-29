type ProfileCircleProps = {
    name: string;
    colorHex: string;
    size?: number
}
const ProfileCircle = ({ name, colorHex, size = 40 }: ProfileCircleProps) => {
    const initial = name.charAt(0).toUpperCase();
    return (
        <div className="flex items-center justify-center rounded-full text-white font-semibold"
            style={
                {
                    backgroundColor: colorHex,
                    width: size,
                    height: size,
                }
            }>{initial}</div>
    )
}

export default ProfileCircle