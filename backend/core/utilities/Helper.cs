namespace core.utilities;

public static class Helper
{

    public static decimal ToDecimal(this string? value)
    {
        return decimal.TryParse(
            value,
            System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture,
            out var result
        ) ? result : 0m;
    }
}